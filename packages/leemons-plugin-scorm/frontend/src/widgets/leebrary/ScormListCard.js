import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createStyles, Box, ImageLoader } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { AssignIcon, DuplicateIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scorm/helpers';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { deletePackageRequest, duplicatePackageRequest } from '@scorm/request';

const ScormCardStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderColor: selected && theme.colors.interactive01d,
    borderWidth: selected && '1px',
    boxShadow: selected && theme.shadows.shadow03,
  },
}));

const ScormListCard = ({ asset, selected, onRefresh, ...props }) => {
  const [t] = useTranslateLoader(prefixPN('scormCard'));
  const { classes } = ScormCardStyles({ selected });
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();

  const menuItems = useMemo(() => {
    const items = [];

    if (asset?.id) {
      if (asset.providerData?.published) {
        items.push({
          icon: <ViewOnIcon />,
          children: t('view'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/scorm/${asset.providerData.id}`);
          },
        });
      }
      if (asset.editable) {
        items.push({
          icon: <EditWriteIcon />,
          children: t('edit'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/scorm/${asset.providerData.id}`);
          },
        });
      }
      if (asset.providerData?.published) {
        items.push({
          icon: <AssignIcon />,
          children: t('assign'),
          onClick: (e) => {
            e.stopPropagation();
            history.push(`/private/scorm/assign/${asset.providerData.id}`);
          },
        });
      }

      if (asset.duplicable && asset.providerData) {
        items.push({
          icon: <DuplicateIcon />,
          children: t('duplicate'),
          onClick: (e) => {
            e.stopPropagation();
            openConfirmationModal({
              onConfirm: async () => {
                try {
                  setAppLoading(true);
                  await duplicatePackageRequest(
                    asset.providerData.id,
                    asset.providerData.published
                  );
                  addSuccessAlert(t('duplicated'));
                  onRefresh();
                } catch (err) {
                  addErrorAlert(getErrorMessage(err));
                }
                setAppLoading(false);
              },
            })();
          },
        });
      }
      if (asset.deleteable) {
        items.push({
          icon: <DeleteBinIcon />,
          children: t('delete'),
          onClick: (e) => {
            e.stopPropagation();
            openDeleteConfirmationModal({
              onConfirm: async () => {
                try {
                  setAppLoading(true);
                  await deletePackageRequest(asset.providerData.id);
                  addSuccessAlert(t('deleted'));
                  onRefresh();
                } catch (err) {
                  addErrorAlert(getErrorMessage(err));
                }
                setAppLoading(false);
              },
            })();
          },
        });
      }
      // if (asset.shareable) {
      //   items.push({
      //     icon: null,
      //     children: t('share'),
      //     onClick: () => {},
      //   });
      // }
    }

    return items;
  }, [asset, t]);

  const variantIcon = (
    <Box style={{ position: 'relative', width: 14, height: 14 }}>
      <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.875,23.248H3.447a.819.819,0,0,1-.822-.815V1.727A.983.983,0,0,1,3.612.748H20.388a.983.983,0,0,1,.987.979V4.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.375 17.674L16.875 19.701 16.875 13.113 21.375 11.086 21.375 17.674z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.375,22.235c0,.56-.672,1.013-1.5,1.013h-3V19.7l4.5-2.027Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.375,11.087l-4.5,2.026V7.539a2.063,2.063,0,0,1,1.248-1.576L21.375,4.5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </Box>
  );

  return (
    <LibraryCard
      {...props}
      asset={asset}
      menuItems={menuItems}
      variant="document"
      variantTitle={t('document')}
      className={classes.root}
      variantIcon={variantIcon}
    />
  );
};

ScormListCard.propTypes = {
  asset: PropTypes.any,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default ScormListCard;
