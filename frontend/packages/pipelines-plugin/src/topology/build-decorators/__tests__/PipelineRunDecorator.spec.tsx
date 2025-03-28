import { shallow } from 'enzyme';
import { Link } from 'react-router-dom-v5-compat';
import * as rbacModule from '@console/internal/components/utils/rbac';
import { BuildDecoratorBubble } from '@console/topology/src/components/graph-view';
import * as taskRunsUtils from '../../../components/taskruns/useTaskRuns';
import { ConnectedPipelineRunDecorator } from '../PipelineRunDecorator';
import { connectedPipelineOne } from './decorator-data';

const spyUseTaskRuns = jest.spyOn(taskRunsUtils, 'useTaskRuns');

describe('PipelineRunDecorator renders', () => {
  let spyUseAccessReview;
  beforeEach(() => {
    spyUseAccessReview = jest.spyOn(rbacModule, 'useAccessReview');
    spyUseAccessReview.mockReturnValue(true);
    spyUseTaskRuns.mockReturnValue([[], true]);
  });

  it('expect a log link when it contains at least one PipelineRun', () => {
    const decoratorComp = shallow(
      <ConnectedPipelineRunDecorator
        pipeline={connectedPipelineOne.pipeline}
        pipelineRuns={connectedPipelineOne.pipelineRuns}
        radius={0}
        x={0}
        y={0}
      />,
    );
    const linkComp = decoratorComp.find(Link);
    expect(linkComp.exists()).toBe(true);
  });

  it('expect not to find a Link component when there is no PipelineRuns associated', () => {
    const decoratorComp = shallow(
      <ConnectedPipelineRunDecorator
        pipeline={connectedPipelineOne.pipeline}
        pipelineRuns={[]}
        radius={0}
        x={0}
        y={0}
      />,
    );
    expect(decoratorComp.find(Link).exists()).toBe(false);
    expect(decoratorComp.find(BuildDecoratorBubble).props().onClick).not.toBe(null);
  });

  it('expect not to find an onClick functionality when there is a lack of permissions', () => {
    spyUseAccessReview.mockReturnValue(false);
    const decoratorComp = shallow(
      <ConnectedPipelineRunDecorator
        pipeline={connectedPipelineOne.pipeline}
        pipelineRuns={[]}
        radius={0}
        x={0}
        y={0}
      />,
    );
    expect(decoratorComp.find(Link).exists()).toBe(false);
    expect(decoratorComp.find(BuildDecoratorBubble).props().onClick).toBe(null);
  });
});
