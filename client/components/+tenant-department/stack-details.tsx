import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {Col, Row} from "../grid";
import {Divider} from 'antd';
import {Stack} from "../../api/endpoints";
import {Select} from "../select";

export const stack: Stack = {
  address: "",
  verification: "Certificate",
  token: "",
  user: "",
  password: ""
}

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;
  name?: string

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class StackDetails extends React.Component<Props> {

  static defaultProps: { name: "Git" }
  @observable value: Stack[] = this.props.value || [];

  add = () => {
    this.value.push(stack);
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  get Options() {
    return [
      "Certificate",
      "Account"
    ]
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Stack`)}
        material="add_circle_outline"
        onClick={(e) => {
          this.add();
          e.stopPropagation();
        }}
      />
    )
  }

  render() {

    const {name} = this.props

    return (
      <>
        {this.props.divider ? <Divider/> : <></>}
        <SubTitle className="fields-title" title={_i18n._(name)}>{this.renderAdd()}</SubTitle>
        <div className="stack">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <Icon
                  small
                  tooltip={_i18n._(t`Remove Stack`)}
                  className="remove-icon"
                  material="remove_circle_outline"
                  onClick={(e) => {
                    this.remove(index);
                    e.stopPropagation()
                  }}
                />
                <SubTitle title={<Trans>Address</Trans>}/>
                <Input
                  className="item"
                  placeholder={_i18n._(t`Address`)}
                  title={this.value[index].address}
                  value={this.value[index].address}
                  onChange={value => {
                    this.value[index].address = value
                  }}
                />
                <SubTitle title={<Trans>Verification</Trans>}/>
                <Select
                  options={this.Options}
                  value={this.value[index].verification}
                  onChange={value => this.value[index].verification = value.value}
                />
                {this.value[index].verification == "Certificate" ?
                  <>
                    <SubTitle title={<Trans>Token</Trans>}/>
                    <Input
                      className="item"
                      placeholder={_i18n._(t`Token`)}
                      title={this.value[index].token}
                      value={this.value[index].token}
                      onChange={value => {
                        this.value[index].token = value
                      }}
                    />
                    <br/>
                  </> : <></>}
                {this.value[index].verification == "Account" ?
                  <>
                    <SubTitle title={<Trans>User</Trans>}/>
                    <Input
                      className="item"
                      placeholder={_i18n._(t`User`)}
                      title={this.value[index].user}
                      value={this.value[index].user}
                      onChange={value => {
                        this.value[index].user = value
                      }}
                    />
                    <SubTitle title={<Trans>Password</Trans>}/>
                    <Input
                      className="item"
                      placeholder={_i18n._(t`Password`)}
                      title={this.value[index].password}
                      value={this.value[index].password}
                      onChange={value => {
                        this.value[index].password = value
                      }}
                    />
                    <br/>
                  </> : <></>}
              </div>
            )
          })}
        </div>
      </>
    )
  }
}