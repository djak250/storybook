/* eslint-disable global-require */
import * as api from '@storybook/manager-api';
import { PANEL_ID } from './constants';
import './manager';

jest.mock('../../../ui/manager/src/api');
jest.mock('@storybook/manager-api', () => {
  const m = require('../../../ui/manager/src/api');
  return m;
});

const mockedApi = api as unknown as jest.Mocked<api.API>;
mockedApi.useAddonState = jest.fn();
const mockedAddons = api.addons as jest.Mocked<typeof api.addons>;
const registrationImpl = mockedAddons.register.mock.calls[0][1];

describe('A11yManager', () => {
  it('should register the panels', () => {
    // when
    registrationImpl(mockedApi);

    // then
    expect(mockedAddons.add.mock.calls).toHaveLength(2);
    expect(mockedAddons.add).toHaveBeenCalledWith(PANEL_ID, expect.anything());

    const panel = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.PANEL);
    const tool = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.TOOL);
    expect(panel).toBeDefined();
    expect(tool).toBeDefined();
  });

  it('should compute title with no issues', () => {
    // given
    mockedApi.useAddonState.mockImplementation(() => [undefined]);
    registrationImpl(api as unknown as api.API);
    const title = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.PANEL)?.title as Function;

    // when / then
    expect(title()).toMatchInlineSnapshot(`
      <div>
        <Spaced
          col={1}
        >
          <span
            style={
              Object {
                "display": "inline-block",
                "verticalAlign": "middle",
              }
            }
          >
            Accessibility
          </span>
          
        </Spaced>
      </div>
    `);
  });

  it('should compute title with issues', () => {
    // given
    mockedApi.useAddonState.mockImplementation(() => [
      {
        violations: [{}],
        incomplete: [{}, {}],
      },
    ]);
    registrationImpl(mockedApi);
    const title = mockedAddons.add.mock.calls
      .map(([_, def]) => def)
      .find(({ type }) => type === api.types.PANEL)?.title as Function;

    // when / then
    expect(title()).toMatchInlineSnapshot(`
      <div>
        <Spaced
          col={1}
        >
          <span
            style={
              Object {
                "display": "inline-block",
                "verticalAlign": "middle",
              }
            }
          >
            Accessibility
          </span>
          <Badge
            status="neutral"
          >
            3
          </Badge>
        </Spaced>
      </div>
    `);
  });
});
