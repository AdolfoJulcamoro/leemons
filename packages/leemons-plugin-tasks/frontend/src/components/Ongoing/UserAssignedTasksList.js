import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { unflatten, LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  Table,
  ContextContainer,
  Button,
  Text,
  SearchInput,
  useDebouncedValue,
} from '@bubbles-ui/components';
import { ViewOnIcon, StudyDeskIcon } from '@bubbles-ui/icons/outline';
import { prefixPN } from '../../helpers/prefixPN';
import Filters from './Filters';
import listUserTasks from '../../request/instance/listUserTasks';

function Actions({ id, profile }) {
  const history = useHistory();
  return (
    <ContextContainer alignItems="center" direction="row">
      <ViewOnIcon
        as="button"
        color="secondary"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          profile === 'teacher'
            ? history.push(`/private/tasks/details/${id}`)
            : history.push(`/private/tasks/student-detail/${id}`)
        }
      />
    </ContextContainer>
  );
}

Actions.propTypes = {
  id: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
};

async function getTasks(filters, setTasks, setProfile) {
  const response = await listUserTasks({ ...filters, details: true });

  const assignedTasks = response?.data?.items?.map((t) => {
    const task = t;
    task.students.count = t.students.count;
    task.group = '-';
    task.students.open = `${t.students.open} | ${
      t.students.count ? Math.round((t.students.open / t.students.count) * 100) : 0
    }%`;
    task.students.ongoing = `${t.students.ongoing} | ${
      t.students.count ? Math.round((t.students.ongoing / t.students.count) * 100) : 0
    }%`;
    task.students.completed = `${t.students.completed} | ${
      t.students.count ? Math.round((t.students.completed / t.students.count) * 100) : 0
    }%`;

    task.startDate = t.startDate ? (
      <LocaleDate date={t.startDate} options={{ dateStyle: 'short', timeStyle: 'short' }} />
    ) : (
      '-'
    );
    task.timeUntilDeadline = `${dayjs(t.deadline).diff(dayjs(), 'days')} days left`;

    task.deadline = t.alwaysOpen ? (
      '-'
    ) : (
      <LocaleDate date={t.deadline} options={{ dateStyle: 'short', timeStyle: 'short' }} />
    );

    task.actions = <Actions id={task.id} profile={response?.data?.profile} />;

    return task;
  });

  setProfile(response?.data?.profile);
  setTasks(assignedTasks);

  return response;
}

export default function UserAssignedTasksList({
  showClosed,
  defaultFilters = {},
  showFilters = true,
}) {
  const [, translations] = useTranslateLoader(prefixPN('teacher_assignments'));
  const [tableLabels, setTableLabels] = useState({});
  const [name, setName] = useState('');
  const [debouncedName] = useDebouncedValue(name, 500);
  const [filters, setFilters] = useState(defaultFilters);
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const history = useHistory();

  useEffect(() => {
    setTasks([]);
    setFilters((f) => ({
      ...f,
      name: debouncedName,
    }));
  }, [debouncedName]);

  // EN: Parse the translations object
  // ES: Procesar el objeto de traducciones
  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res?.plugins?.tasks?.teacher_assignments;

      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
      setTableLabels(data.table.headers);
    }
  }, [translations]);

  const columns = useMemo(() => {
    const cols = {
      group: {
        Header: tableLabels?.group,
        accessor: 'group',
      },
      task: {
        Header: tableLabels?.task,
        accessor: 'task.name',
      },
      startDate: {
        Header: tableLabels?.startDate || 'Start Date',
        accessor: 'startDate',
      },
      deadline: {
        Header: tableLabels?.deadline,
        accessor: 'deadline',
      },
      timeReference: {
        Header: tableLabels?.timeReference || 'Time reference',
        accessor: 'timeUntilDeadline',
      },
      studentCount: {
        Header: tableLabels?.students,
        accessor: 'students.count',
      },
      status: {
        Header: tableLabels?.status,
        accessor: 'status',
      },
      opened: {
        Header: tableLabels?.open,
        accessor: 'students.open',
      },
      ongoing: {
        Header: tableLabels?.ongoing,
        accessor: 'students.ongoing',
      },
      completed: {
        Header: tableLabels?.completed,
        accessor: 'students.completed',
      },
      actions: {
        Header: tableLabels?.actions,
        accessor: 'actions',
      },
    };

    const teacherColumns = [
      cols.group,
      cols.task,
      cols.deadline,
      cols.studentCount,
      cols.status,
      cols.opened,
      cols.ongoing,
      cols.completed,
      cols.actions,
    ];

    const studentColumns = [
      cols.task,
      cols.startDate, // TODO
      cols.deadline,
      cols.status,
      cols.timeReference, // TODO
      cols.actions,
    ];

    if (profile === 'teacher') {
      return teacherColumns;
    }

    if (profile === 'student') {
      return studentColumns;
    }

    return [];
  }, [tableLabels, profile]);

  useEffect(() => {
    getTasks({ showClosed, hideOpened: showClosed, ...filters }, setTasks, setProfile);
  }, [filters]);

  return (
    <>
      {showFilters && (
        <Filters
          onChange={(f) => {
            setTasks([]);
            setFilters(f);
          }}
        />
      )}
      <SearchInput value={name} onChange={setName} />
      {tasks?.length === 0 && (
        <ContextContainer direction="row" justifyContent="start" alignItems="center">
          {/* TRANSLATE: You do not have ongoing tasks */}
          <Text>You don&apos;t have ongoing tasks with the applied filters. Assign a new one</Text>
          <Button noFlex onClick={() => history.push('/private/tasks/library')}>
            Go to Library
          </Button>
        </ContextContainer>
      )}
      {tasks?.length > 0 && <Table columns={columns} data={tasks} />}
    </>
  );
}

UserAssignedTasksList.propTypes = {
  showClosed: PropTypes.bool,
};