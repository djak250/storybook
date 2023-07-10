import React from 'react';
import { IconButton, Icons } from '@storybook/components';
import type { Addon_BaseType } from '@storybook/types';
import type { Combo } from '../../../api';
import { Consumer, types } from '../../../api';

const menuMapper = ({ api, state }: Combo) => ({
  isVisible: state.layout.showPanel,
  singleStory: state.singleStory,
  panelPosition: state.layout.panelPosition,
  toggle: () => api.togglePanel(),
});

export const addonsTool: Addon_BaseType = {
  title: 'addons',
  id: 'addons',
  type: types.TOOL,
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={menuMapper}>
      {({ isVisible, toggle, singleStory, panelPosition }) =>
        !singleStory &&
        !isVisible && (
          <>
            <IconButton aria-label="Show addons" key="addons" onClick={toggle} title="Show addons">
              <Icons icon={panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt'} />
            </IconButton>
          </>
        )
      }
    </Consumer>
  ),
};
