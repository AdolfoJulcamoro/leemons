import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Kanban as BubblesKanban } from '@bubbles-ui/components';
import { getCentersWithToken } from '@users/session';
import {
  getCalendarsToFrontendRequest,
  listKanbanColumnsRequest,
  listKanbanEventOrdersRequest,
  saveKanbanEventOrdersRequest,
  updateEventRequest,
} from '@calendar/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import getCalendarNameWithConfigAndSession from '@calendar/helpers/getCalendarNameWithConfigAndSession';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { KanbanFilters, KanbanTaskCard } from '@bubbles-ui/leemons';
import * as _ from 'lodash';
import hooks from 'leemons-hooks';

function Kanban({ session }) {
  const ref = useRef({
    loading: true,
    filtersData: {
      calendars: [],
    },
    filters: {
      showArchived: false,
      calendars: [],
    },
  });
  const prefix = prefixPN('kanbanFiltersOptions');
  const [, translations] = useTranslateLoader(prefix);
  const [toggleEventModal, EventModal] = useCalendarEventModal();
  const [, setR] = useState();

  function render() {
    setR(new Date().getTime());
  }

  const filterMessages = useMemo(() => {
    if (translations && translations.items) {
      return _.reduce(
        translations.items,
        (acc, value, key) => {
          acc[key.replace(`${prefix}.`, '')] = value;
          return acc;
        },
        {}
      );
    }
    return {};
  }, [translations]);

  // ES: Consultas
  // EN: Queries
  async function getKanbanColumns() {
    const { columns } = await listKanbanColumnsRequest();
    return _.orderBy(columns, ['order'], ['asc']);
  }

  async function getTranslationColumns() {
    const keys = _.map(ref.current.columns, 'nameKey');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    return items;
  }

  async function getKanbanColumnsEventsOrder() {
    const { orders } = await listKanbanEventOrdersRequest(ref.current.center.token);
    const obj = {};
    _.forEach(orders, (order) => {
      obj[order.column] = order.events;
    });
    return obj;
  }

  async function getCalendarsForCenter() {
    const { status, ...response } = await getCalendarsToFrontendRequest(ref.current.center.token);

    return {
      ...response,
      calendars: _.map(response.calendars, (calendar) => ({
        ...calendar,
        name: getCalendarNameWithConfigAndSession(calendar, response, session),
      })),
    };
  }

  function getColumnName(name) {
    return tKeys(name, ref.current.columnsT);
  }

  function getKanbanBoard() {
    const cols = [];
    const eventsByColumn = _.groupBy(ref.current.data.events, 'data.column');
    _.forEach(ref.current.columns, (column) => {
      if (!column.isArchived || (column.isArchived && ref.current.filters.showArchived)) {
        let cards = [];
        if (eventsByColumn[column.id] && ref.current.columnsEventsOrders[column.id]) {
          const cardsNoOrdered = [];
          _.forEach(eventsByColumn[column.id], (event) => {
            const index = ref.current.columnsEventsOrders[column.id].indexOf(event.id);
            if (index >= 0) {
              cards[index] = event;
            } else {
              cardsNoOrdered.push(event);
            }
          });
          cards = _.map(cardsNoOrdered, (c) => ({ ...c, notOrdered: true })).concat(cards);
        } else {
          cards = eventsByColumn[column.id] || [];
        }

        cards = _.filter(cards, (c) => !!c);

        if (ref.current.filters.calendars.length) {
          cards = _.filter(cards, (c) => ref.current.filters.calendars.indexOf(c.calendar) >= 0);
        }

        cols.push({
          id: column.id,
          title: getColumnName(column.nameKey),
          cards,
        });
      }
    });
    return { columns: cols };
  }

  function onChange(values, event) {
    const cardsById = {};
    _.forEach(values.columns, (column) => {
      _.forEach(column.cards, (card) => {
        cardsById[card.id] = { ...card, data: { ...card.data, column: column.id } };
      });
    });
    const changedColumns = [];
    if (
      event.destination &&
      event.source &&
      event.destination.droppableId === event.source.droppableId
    ) {
      changedColumns.push(event.destination.droppableId);
    }
    _.forEach(ref.current.data.events, (event) => {
      const card = cardsById[event.id];
      if (event.data && event.data.column && card && event.data.column !== card.data.column) {
        changedColumns.push(card.data.column);
        // eslint-disable-next-line no-param-reassign
        event.data.column = card.data.column;
        updateEventRequest(ref.current.center.token, event.id, { data: event.data });
      }
    });

    _.forEach(values.columns, (column) => {
      if (changedColumns.indexOf(column.id) >= 0) {
        ref.current.columnsEventsOrders[column.id] = _.map(column.cards, 'id');
        saveKanbanEventOrdersRequest(
          ref.current.center.token,
          column.id,
          ref.current.columnsEventsOrders[column.id]
        );
      }
    });

    ref.current.board = getKanbanBoard();
    render();
  }

  function onFiltersChange(event) {
    ref.current.filters = {
      ...event,
      calendars: event.calendars && event.calendars !== '*' ? [event.calendars] : [],
    };
    ref.current.board = getKanbanBoard();
    render();
  }

  function addEventClick() {
    ref.current.event = null;
    toggleEventModal();
  }

  function onClickCard(e) {
    ref.current.event = e;
    toggleEventModal();
  }

  // ES: Carga
  // EN: Load

  async function onCenterChange() {
    ref.current.columnsEventsOrders = await getKanbanColumnsEventsOrder();
    ref.current.data = await getCalendarsForCenter();
    ref.current.filtersData.calendars = _.map(
      _.filter(ref.current.data.calendars, { isClass: true }),
      (calendar) => ({ label: calendar.name, value: calendar.id })
    );
  }

  async function init() {
    ref.current.columns = await getKanbanColumns();
    ref.current.columnsT = await getTranslationColumns();
    ref.current.centers = getCentersWithToken();
    if (ref.current.centers.length) {
      [ref.current.center] = ref.current.centers;
      await onCenterChange();
      ref.current.board = getKanbanBoard();
    }

    ref.current.loading = false;
    render();
  }

  async function reload() {
    await onCenterChange();
    ref.current.board = getKanbanBoard();
    render();
  }

  useEffect(() => {
    if (session) init();
  }, [session]);

  useEffect(() => {
    hooks.addAction('calendar:force:reload', reload);
    return () => {
      hooks.removeAction('calendar:force:reload', reload);
    };
  });

  return (
    <Box
      sx={(theme) => ({
        height: '100vh',
        paddingTop: theme.spacing[12],
        background: theme.colors.uiBackground02,
      })}
    >
      {ref.current.center ? (
        <EventModal
          centerToken={ref.current.center.token}
          classCalendars={ref.current.filtersData.calendars}
          event={ref.current.event}
          close={toggleEventModal}
          forceType="plugins.calendar.task"
        />
      ) : null}
      <Box sx={() => ({ position: 'absolute', top: 0, left: 0, width: '100%' })}>
        <KanbanFilters
          data={{
            ...ref.current.filtersData,
            calendars: [
              {
                label: filterMessages.selectCalendarsSubjects,
                value: '*',
              },
              ...ref.current.filtersData.calendars,
            ],
          }}
          value={{ ...ref.current.filters, calendars: ref.current.filters.calendars[0] || '*' }}
          onChange={onFiltersChange}
          messages={filterMessages}
          addEventClick={addEventClick}
        />
      </Box>
      <Box sx={(theme) => ({ paddingTop: theme.spacing[5], height: '100%' })}>
        {ref.current.board ? (
          <BubblesKanban
            value={ref.current.board}
            onChange={onChange}
            disableCardDrag={ref.current.filters.calendars.length}
            itemRender={(props) => (
              <KanbanTaskCard {...props} config={ref.current.data} onClick={onClickCard} />
            )}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default Kanban;