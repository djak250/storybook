/* eslint-disable no-underscore-dangle,no-param-reassign */
import type { Args, Renderer, ArgsEnhancer } from '@storybook/types';
import { action } from './runtime/action';

// interface ActionsParameter {
//   disable?: boolean;
//   argTypesRegex?: RegExp;
// }

const isInInitialArgs = (name: string, initialArgs: Args) =>
  typeof initialArgs[name] === 'undefined' && !(name in initialArgs);

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */

export const inferActionsFromArgTypesRegex: ArgsEnhancer<Renderer> = (context) => {
  const {
    initialArgs,
    argTypes,
    parameters: { actions },
  } = context;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return {};
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  const argTypesMatchingRegex = Object.entries(argTypes).filter(
    ([name]) => !!argTypesRegex.test(name)
  );

  return argTypesMatchingRegex.reduce((acc, [name, argType]) => {
    if (isInInitialArgs(name, initialArgs)) {
      acc[name] = action(name, { implicit: true });
    }
    return acc;
  }, {} as Args);
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: ArgsEnhancer<Renderer> = (context) => {
  const {
    initialArgs,
    argTypes,
    parameters: { actions },
  } = context;
  if (actions?.disable || !argTypes) {
    return {};
  }

  const argTypesWithAction = Object.entries(argTypes).filter(
    ([name, argType]) => !!argType['action']
  );

  return argTypesWithAction.reduce((acc, [name, argType]) => {
    if (isInInitialArgs(name, initialArgs)) {
      acc[name] = action(typeof argType['action'] === 'string' ? argType['action'] : name);
    }
    return acc;
  }, {} as Args);
};

export const attachActionsToFunctionMocks: ArgsEnhancer<Renderer> = (context) => {
  const {
    initialArgs,
    argTypes,
    parameters: { actions },
  } = context;
  if (actions?.disable || !argTypes) {
    return {};
  }

  const argTypesWithAction = Object.entries(initialArgs).filter(
    ([, value]) =>
      typeof value === 'function' &&
      '_isMockFunction' in value &&
      value._isMockFunction &&
      !value._actionAttached
  );

  return argTypesWithAction.reduce((acc, [key, value]) => {
    const previous = value.getMockImplementation();
    value.mockImplementation((...args: unknown[]) => {
      action(key)(...args);
      return previous?.(...args);
    });
    // this enhancer is being called multiple times
    value._actionAttached = true;
    return acc;
  }, {} as Args);
};
