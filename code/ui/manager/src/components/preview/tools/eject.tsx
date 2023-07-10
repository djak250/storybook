import { global } from '@storybook/global';
import React from 'react';
import { getStoryHref, IconButton, Icons } from '@storybook/components';
import type { Addon_BaseType } from '@storybook/types';
import type { Combo } from '../../../api';
import { Consumer, types } from '../../../api';

const { PREVIEW_URL } = global;

const ejectMapper = ({ state }: Combo) => {
  const { storyId, refId, refs } = state;
  const ref = refs[refId];

  return {
    refId,
    baseUrl: ref ? `${ref.url}/iframe.html` : (PREVIEW_URL as string) || 'iframe.html',
    storyId,
    queryParams: state.customQueryParams,
  };
};

export const ejectTool: Addon_BaseType = {
  title: 'eject',
  id: 'eject',
  type: types.TOOL,
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) =>
        storyId ? (
          <IconButton
            key="opener"
            href={getStoryHref(baseUrl, storyId, queryParams)}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="sharealt" />
          </IconButton>
        ) : null
      }
    </Consumer>
  ),
};
