import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { flatMap, get, keyBy, map, uniq } from 'lodash';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import {
  Box,
  Button,
  ImageLoader,
  Swiper,
  Text,
  createStyles,
  useTheme,
} from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import loadable from '@loadable/component';
import useCategories from '@leebrary/request/hooks/queries/useCategories';
import { LibraryCard } from '@bubbles-ui/leemons';
import { useLocale } from '@common';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import { useStudentState } from '@learning-paths/components/ModuleDashboard/components';

// useLocalizations

function useUserModules({ class: klass, program }) {
  const isTeacher = useIsTeacher();

  const { data: activities, isLoading: ongoingModulesAreLoading } = useSearchOngoingActivities({
    isTeacher,
    role: 'learningpaths.module',
    programs: JSON.stringify([program]),
    classes: JSON.stringify([klass]),
    isArchived: false,
    sort: 'assignation',
    offset: 0,
    limit: 10,
  });

  const modules = activities?.items;

  const { data: modulesData, isLoading: modulesDataIsLoading } = useInstances({
    ids: modules,
    enabled: !!activities?.count,
  });

  return { data: modulesData, isLoading: ongoingModulesAreLoading || modulesDataIsLoading };
}

function useModulesActivities(modules) {
  const activitiesIds = useMemo(
    () => uniq(map(flatMap(modules, 'metadata.module.activities'), 'id')),
    [modules]
  );

  const isTeacher = useIsTeacher();

  const { data: modulesActivities, isLoading } = useAssignationsByProfile(activitiesIds, {
    enabled: !!activitiesIds?.length,
  });

  const activitiesById = useMemo(() => {
    const obj = {};
    modulesActivities?.forEach((activity) => {
      if (isTeacher) {
        obj[activity?.id] = { activity, assignation: null };
      } else {
        obj[activity?.instance?.id] = { activity: activity.instance, assignation: activity };
      }
    });
    return obj;
  }, [modulesActivities]);

  return { data: activitiesById, isLoading };
}

function useModulesData({ class: klass, program }) {
  const { data: modules, isLoading: modulesAreLoading } = useUserModules({ class: klass, program });
  const { data: activities, isLoading: activitiesAreLoading } = useModulesActivities(modules);

  return useMemo(() => {
    if (modulesAreLoading || activitiesAreLoading) {
      return [];
    }

    return modules.map((module) => ({
      ...module,
      metadata: {
        ...module.metadata,
        module: {
          ...module.metadata.module,
          activities: module.metadata.module.activities.map((activity) => ({
            ...activity,
            activity: activities[activity.id].activity,
            assignation: activities[activity.id].assignation,
          })),
        },
      },
    }));
  }, [modules, activities]);
}

function useSwiperProps() {
  const theme = useTheme();
  return useMemo(
    () => ({
      selectable: true,
      deselectable: false,
      disableSelectedStyles: true,
      breakAt: {
        [theme.breakpoints.xs]: {
          slidesPerView: 1,
          spaceBetween: theme.spacing[4],
        },
        [theme.breakpoints.sm]: {
          slidesPerView: 2,
          spaceBetween: theme.spacing[4],
        },
        [theme.breakpoints.lg]: {
          slidesPerView: 3,
          spaceBetween: theme.spacing[4],
        },
      },
      slideStyles: {
        height: 'auto',
      },
    }),
    [theme]
  );
}

function ActivityCard({ activity, assignation }) {
  const { roleDetails, role, id } = activity.assignable;
  const roles = useRolesLocalizations([role]);
  const asset = prepareAsset(activity.assignable.asset);
  const roleIcon = roleDetails?.icon?.startsWith('http')
    ? roleDetails?.icon
    : `${leemons.apiUrl}${roleDetails.icon}`;

  const isStudent = useIsStudent();
  const { isFinished } = useStudentState({ assignation });

  let url = (roleDetails.dashboardURL || '/private/assignables/details/:id').replace(':id', id);

  if (isStudent) {
    if (isFinished) {
      url = roleDetails?.evaluationDetailUrl
        ?.replace(':id', id)
        ?.replace(':user', assignation?.user);
    } else {
      url = roleDetails?.studentDetailUrl?.replace(':id', id)?.replace(':user', assignation?.user);
    }
  }

  const locale = useLocale();

  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <LibraryCard
        fullHeight
        variantIcon={
          <Box style={{ position: 'relative', width: 16, height: 16 }}>
            <ImageLoader src={roleIcon} width={16} height={16} />
          </Box>
        }
        variantTitle={get(roles, `${role}.singular`)}
        locale={locale}
        asset={asset}
      />
    </Link>
  );
}

function ActivitiesCarousel({ activities }) {
  const swiperProps = useSwiperProps();
  return (
    <Swiper {...swiperProps}>
      {activities.map(({ activity, assignation }) => (
        <ActivityCard activity={activity} assignation={assignation} key={activity.id} />
      ))}
    </Swiper>
  );
}

export const useModuleRowStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.padding.md,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      ...globalTheme.content.typo.heading.sm,
      // TODO: Define token
      color: '#454E5F',
      verticalAlign: 'center',
    },
  };
});

function ModuleRow({ module }) {
  const { assignable, metadata } = module;
  const { name } = assignable.asset;
  const { activities } = metadata.module;

  // const moduleActivities = useMemo(() => map(activities, 'activity'), [activities]);

  const { classes } = useModuleRowStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Text className={classes.name}>{name}</Text>
        <Link to={`/private/learning-paths/modules/dashboard/${module.id}`}>
          <Button variant="link">Ver todas las actividades</Button>
        </Link>
      </Box>
      <Box className={classes.carousel}>
        <ActivitiesCarousel activities={activities} />
      </Box>
      {/* {activities.map(({ activity }) => activity.assignable.asset.name)} */}
    </Box>
  );
}

export const useModulesTabStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.xlg,

      padding: globalTheme.spacing.padding['3xlg'],
      paddingTop: globalTheme.spacing.padding.xlg,
    },
  };
});

export default function ModulesTab({ classe: { id: klass, program } }) {
  const modules = useModulesData({ class: klass, program });

  const { classes } = useModulesTabStyles();

  return (
    <Box className={classes.root}>
      {modules.map((module) => (
        <ModuleRow key={module.id} module={module} />
      ))}
    </Box>
  );
}

// Index.propTypes = {
// ...props: PropTypes.any,
// }