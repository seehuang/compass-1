import { ActionMeta } from "react-select/src/types";
import { observer } from "mobx-react";
import React from "react";
import { SubTitle } from "../layout/sub-title";
import { Icon } from "../icon";
import { _i18n } from "../../i18n";
import { t, Trans } from "@lingui/macro";
import { Input } from "../input";
import { observable } from "mobx";
import { Params } from "./common";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  disable?: boolean;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class ParamsDetails extends React.Component<Props> {
  static defaultProps = {
    disable: false,
  };

  @observable value: Params[] = this.props.value || [];

  add = () => {
    this.value.push({
      name: "",
      value: "",
    });
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rParams(index: number, disable: boolean) {
    return (
      <>
        <Grid container spacing={3} alignItems="center" direction="row">
          <Grid item xs={5} zeroMinWidth>
            <Input
              className="item"
              disabled={disable}
              placeholder={_i18n._(t`Name`)}
              title={this.value[index].name}
              value={this.value[index].name}
              onChange={(value) => {
                this.value[index].name = value;
              }}
            />
          </Grid>
          <Grid item xs={5} zeroMinWidth>
            <Input
              className="item"
              // disabled={disable}
              placeholder={_i18n._(t`Value`)}
              title={this.value[index].value}
              value={this.value[index].value}
              onChange={(value) => {
                this.value[index].value = value;
              }}
            />
          </Grid>
          {!disable ? (
            <Grid item xs zeroMinWidth>
              <Icon
                small
                tooltip={<Trans>Remove Params</Trans>}
                className="remove-icon"
                material="clear"
                onClick={(e) => {
                  this.remove(index);
                  e.stopPropagation();
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      </>
    )
  }

  render() {
    const { disable } = this.props;

    return (
      <div>
        <SubTitle
          title={
            <>
              <Trans>Params</Trans>
              {!disable?
                <>
                  &nbsp;&nbsp;
                  <Icon material={"edit"} className={"editIcon"} onClick={event => {
                    stopPropagation(event);
                    this.add()
                  }} small/>
                </>: null}
            </>
          }>
        </SubTitle>
        <div className="params">
          {this.value.map((item, index) => {
            return this.rParams(index, disable);
          })}
        </div>
      </div>
    );
  }
}
