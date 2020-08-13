import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import {
  tektonStoreApi,
  TektonStore,
  Task,
  Pipeline,
  PipelineTask,
} from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { tektonStore } from "./taskstore.store";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { configStore } from "../../config.store";
import { taskStore } from "../+tekton-task/task.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { PipelineEntity, ResourceType } from "./add-tekton-store-dailog";
import { Notifications } from "../notifications";
import {
  TektonGraph,
  GraphData,
} from "../../api/endpoints/tekton-graph.api";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { IKubeObjectMetadata } from "client/api/kube-object";

enum sortBy {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class TektonStoreLayout extends React.Component<Props> {
  render() {
    return (
      <KubeObjectListLayout
        isClusterScoped
        className="TektonStores"
        store={tektonStore}
        dependentStores={[taskStore, pipelineStore, tektonGraphStore]} // other
        sortingCallbacks={{
          [sortBy.name]: (tektonStore: TektonStore) => tektonStore.getName(),
          [sortBy.namespace]: (tektonStore: TektonStore) => tektonStore.getNs(),
          [sortBy.age]: (tektonStore: TektonStore) => tektonStore.getAge(false),
        }}
        searchFilters={[
          (tektonStore: TektonStore) => tektonStore.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>TektonStore</Trans>}
        renderTableHeader={[
          {
            title: <Trans>Name</Trans>,
            className: "name",
            sortBy: sortBy.name,
          },
          {
            title: <Trans>Namespace</Trans>,
            className: "namespace",
            sortBy: sortBy.namespace,
          },
          {
            title: <Trans>Type</Trans>,
            className: "type",
          },
          {
            title: <Trans>Author</Trans>,
            className: "author",
          },
          {
            title: <Trans>Forks</Trans>,
            className: "forks",
          },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(tektonStore: TektonStore) => [
          tektonStore.getName(),
          tektonStore.getNs(),
          tektonStore.getType(),
          tektonStore.getAuthor(),
          tektonStore.getForks(),
          tektonStore.getAge(),
        ]}
        renderItemMenu={(item: TektonStore) => {
          return <TektonStoreMenu object={item} />;
        }}
      />
    );
  }
}

export function TektonStoreMenu(props: KubeObjectMenuProps<TektonStore>) {
  const { object, toolbar } = props;
  const createTaskResource = (taskData: Task) => {
    const taskName = taskData.metadata.name;
    try {
      taskStore.create(
        {
          name: taskName,
          namespace: configStore.getOpsNamespace(),
          labels: new Map<string, string>().set(
            "namespace",
            configStore.getDefaultNamespace()
          ),
        },
        {
          spec: taskData.spec,
        }
      );
    } catch (e) {
      Notifications.error(<>Fork task {taskName} failed</>);
    }
  };

  const createPipelineResource = (
    pipelineData: Partial<Pipeline>,
    graphDataName: string
  ) => {

    pipelineData.metadata = {
      name: pipelineData.getName() + "-" + new Date().getTime().toString(),
      namespace: configStore.getOpsNamespace(),
      labels: Object.fromEntries(new Map<string, string>().set(
        "namespace",
        configStore.getDefaultNamespace()
      )),
      annotations: Object.fromEntries(new Map<string, string>().set(
        "fuxi.nip.io/tektongraphs",
        graphDataName,
      )),
    } as IKubeObjectMetadata;

    pipelineStore.apply(pipelineData as Pipeline, { ...pipelineData });

  };

  const createGraphData = (graphData: TektonGraph) => {
    tektonGraphStore.create(
      {
        namespace: configStore.getOpsNamespace(),
        name: graphData.metadata.name,
      },
      { ...graphData }
    );
  };

  const getPipelineTasks = (nodes: any): PipelineTask[] => {
    let items: Map<string, any> = new Map<string, any>();
    nodes.map((item: any) => {
      const ids = item.id.split("-");
      if (items.get(ids[0]) === undefined) {
        items.set(ids[0], new Array<any>());
      }
      items.get(ids[0]).push(item);
    });

    const dataMap = items;
    let keys = Array.from(dataMap.keys());

    let tasks: PipelineTask[] = [];

    let tmp = 1;

    keys.map((item: any) => {
      let array = dataMap.get(item);

      if (tmp === 1) {
        array.map((item: any) => {
          let task: any = {};
          task.runAfter = [];
          task.name = item.taskName;
          task.taskRef = { name: item.taskName };
          tasks.push(task);
        });
      } else {
        let result = tmp - 1;
        array.map((item: any) => {
          let task: any = {};
          task.runAfter = [];
          task.name = item.taskName;
          task.taskRef = { name: item.taskName };
          //set task runAfter
          dataMap.get(result.toString()).map((item: any) => {
            task.runAfter.push(item.taskName);
          });

          tasks.push(task);
        });
      }

      tmp++;
    });

    return tasks;
  };

  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          //should fork operator,and crete fork's resource
          try {
            const tektonStoreEntity: TektonStore = object;
            const data = tektonStoreEntity.getData();
            const resourceType = tektonStoreEntity.getType();
            if (data === "") {
              return;
            }
            if (resourceType === ResourceType.Pipeline) {
              const pipelineEntity: PipelineEntity = JSON.parse(data);
              const taskData: Task[] = JSON.parse(pipelineEntity.taskData);
              const graphData: TektonGraph = JSON.parse(
                pipelineEntity.graphData
              );


              const pipelineData: Partial<Pipeline> = new Pipeline(JSON.parse(pipelineEntity.pipelineData));


              let taskMap: any = new Map<string, string>();
              taskData.map((t, index) => {
                const name = t.metadata.name;
                taskData[index].metadata.name =
                  t.metadata.name + "-" + new Date().getTime().toString();
                taskMap[name] = taskData[index].metadata.name;
                createTaskResource(taskData[index]);
              });
              let newGraphData: GraphData = JSON.parse(graphData.spec.data);
              let nodes = newGraphData.nodes;
              nodes.map((node: any, index: number) => {
                nodes[index].taskName = taskMap[node.taskName];
              });

              graphData.spec.data = JSON.stringify(newGraphData);
              createGraphData(graphData);

              const tasks = getPipelineTasks(nodes);
              pipelineData.spec.tasks = tasks;
              createPipelineResource(pipelineData, graphData.metadata.name);
            }

            if (resourceType === ResourceType.Task) {
              const taskData: Task = JSON.parse(data);
              createTaskResource(taskData);
            }

            tektonStoreEntity.spec.forks = tektonStoreEntity.spec.forks + 1;
            tektonStore.update(tektonStoreEntity, { ...tektonStoreEntity });
            Notifications.ok(<>Fork succeeded</>);
          } catch (err) {
            Notifications.error(<>Fork error:{err}</>);
          }
        }}
      >
        <Icon material="cloud_download" title={"Fork"} interactive={toolbar} />
        <span className="title">
          <Trans>Fork</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(tektonStoreApi, { Menu: TektonStoreMenu });
