import * as _ from 'lodash';
import { Modal, useModal } from 'leemons-ui';
import hooks from 'leemons-hooks';
import SimpleBar from 'simplebar-react';
import update from 'immutability-helper';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import MainMenuCloseSubmenuBtn from './mainMenuCloseSubmenuBtn';
import MainMenuSubmenuItem from './mainMenuSubmenuItem';

import DndSortItem from '../dnd/dndSortItem';
import DndDropZone from '../dnd/dndDropZone';
import {
  addMenuItemRequest,
  removeMenuItemRequest,
  reOrderCustomUserItemsRequest,
  updateMenuItemRequest,
} from '../../request';

import { registerDndLayer } from '../dnd/dndLayer';
import MainMenuInfo from './mainMenuInfo';
import prefixPN from '../../helpers/prefixPN';

export default function MainMenuSubmenu({ item, onClose, activeItem }) {
  const [editingItem, setEditingItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [removeItem, setRemoveItem] = useState(null);
  const [customChildrens, setCustomChildrens] = useState(item ? item.customChildrens : []);
  const [translations] = useTranslate({ keysStartsWith: prefixPN('menu.remove_item_modal') });
  const t = tLoader(prefixPN('menu.remove_item_modal'), translations);

  const find = useCallback(
    (id) => {
      const dragItem = _.find(customChildrens, { id });
      return { dragItem, index: customChildrens.indexOf(dragItem) };
    },
    [customChildrens]
  );

  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('title'),
    message: t('message'),
    cancelLabel: t('cancel'),
    actionLabel: t('action'),
    onAction: async () => {
      await removeMenuItemRequest(removeItem.menuKey, removeItem.key);
      const { index } = find(removeItem.id);
      setRemoveItem(null);
      setCustomChildrens(
        update(customChildrens, {
          $splice: [[index, 1]],
        })
      );
    },
  });

  const move = useCallback(
    async (id, atIndex, isLast) => {
      const { dragItem, index } = find(_.isString(id) ? id : id._tempId);
      if (dragItem) {
        if (index !== atIndex || isLast) {
          const newCustomChildrens = update(customChildrens, {
            $splice: [
              [index, 1],
              [atIndex, 0, dragItem],
            ],
          });
          setCustomChildrens(newCustomChildrens);
          if (_.isString(id)) {
            if (isLast) {
              await reOrderCustomUserItemsRequest(
                'plugins.menu-builder.main',
                item.key,
                _.map(newCustomChildrens, 'id')
              );
            }
          }
        }
      } else {
        setCustomChildrens(
          update(customChildrens, {
            $push: [{ ...id, id: id._tempId }],
          })
        );
      }
    },
    [customChildrens, setCustomChildrens]
  );

  const onDrop = useCallback(
    async (droppedItem) => {
      const { _tempId, ...saveItem } = droppedItem;
      const order = _.map(customChildrens, 'id');
      const index = _.findIndex(order, (id) => id === _tempId);
      const { menuItem } = await addMenuItemRequest({ ...saveItem, parentKey: item.key });
      if (index >= 0) {
        order[index] = menuItem.id;
        await reOrderCustomUserItemsRequest('plugins.menu-builder.main', item.key, order);
      }
      await hooks.fireEvent('menu-builder:user:addCustomItem', menuItem);
    },
    [customChildrens, setCustomChildrens]
  );

  const onEnd = (event) => {
    const [{ dragItem, monitor }] = event.args;
    const didDrop = monitor.didDrop();
    if (!didDrop) {
      const index = _.findIndex(customChildrens, (ch) => ch.id === dragItem._tempId);
      if (index >= 0) {
        setCustomChildrens(
          update(customChildrens, {
            $splice: [[index, 1]],
          })
        );
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditingItem(null);
  };

  const remove = async (toRemoveItem) => {
    setRemoveItem(toRemoveItem);
    toggleModal(toRemoveItem);
  };

  const updateItem = async (toUpdateItem, dataToUpdate) => {
    await updateMenuItemRequest(toUpdateItem.menuKey, toUpdateItem.key, dataToUpdate);
    const { index } = find(toUpdateItem.id);
    setCustomChildrens(
      update(customChildrens, {
        [index]: { $merge: dataToUpdate },
      })
    );
    setEditingItem(null);
  };

  const [, drop] = useDrop(() => ({ accept: 'menu-item-sort' }));

  useEffect(() => {
    hooks.addAction('dnd:end', onEnd);
    return () => {
      hooks.removeAction('dnd:end', onEnd);
    };
  });

  useEffect(() => {
    registerDndLayer('menu-item-sort', ({ item: _item }) => (
      <MainMenuSubmenuItem item={find(_item.id).dragItem} isLayer={true} />
    ));
    registerDndLayer('menu-item', ({ item: _item }) => (
      <MainMenuSubmenuItem item={_item} isLayer={true} />
    ));
  }, [find]);

  useEffect(() => {
    if (item) setCustomChildrens(item.customChildrens);
  }, [item]);

  return (
    <>
      {item && (
        <>
          <Modal {...modal} />
          <div className="w-full overflow-hidden h-screen bg-secondary-focus flex flex-col justify-between">
            {/* Header submenu */}
            <div className={'flex flex-row justify-between items-center mb-6 pt-3'}>
              <div className={'w-full pl-6 font-lexend text-base text-secondary-content'}>
                {item.label}
              </div>
              {/* Close submenu */}
              <div className={'px-2'}>
                <MainMenuCloseSubmenuBtn onClick={onClose} />
              </div>
            </div>
            {/* Items submenu */}
            <DndDropZone type={'menu-item'} onDrop={onDrop} className="flex-grow h-px">
              {() => (
                <SimpleBar className="h-full">
                  <nav>
                    <ul>
                      {item.childrens.map((child) => (
                        <li key={child.id}>
                          <MainMenuSubmenuItem item={child} active={activeItem?.id === child.id} />
                        </li>
                      ))}

                      {customChildrens.length ? (
                        <div className="h-px bg-neutral-focus my-3"></div>
                      ) : (
                        ''
                      )}

                      <div ref={drop}>
                        <>
                          {customChildrens.map((child) => (
                            <li key={child.id}>
                              <DndSortItem
                                id={child.id}
                                find={find}
                                move={move}
                                type={'menu-item-sort'}
                                accept={['menu-item-sort', 'menu-item']}
                                emptyLayout={true}
                                disableDrag={!editMode || !!editingItem}
                              >
                                {({ isDragging }) => (
                                  <MainMenuSubmenuItem
                                    item={child}
                                    remove={remove}
                                    editMode={editMode && !editingItem}
                                    changeToEditItem={(e) => setEditingItem(e)}
                                    editItemMode={editingItem === child}
                                    isDragging={!!child._tempId || isDragging}
                                    active={activeItem?.id === child.id}
                                    updateItem={updateItem}
                                  />
                                )}
                              </DndSortItem>
                            </li>
                          ))}
                        </>
                      </div>
                    </ul>
                  </nav>
                </SimpleBar>
              )}
            </DndDropZone>
            {/* Menu constructor */}
            <div>
              <MainMenuInfo editMode={editMode} toggleEditMode={toggleEditMode} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

MainMenuSubmenu.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
  activeItem: PropTypes.object,
};