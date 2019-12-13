import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import cx from 'classnames';

import request from '@api/request';
import osImg from '@resource/osImg/index';
import { useDispatch as useNoticeDispatch } from '@store/notice/index';
import { useDispatch as useAgentsDispatch } from '@store/agents/index';
import { Item } from '@store/agents/types';
import { titleCase, getAgentTypeList } from '@utils/index';

import NewResource from '../NewResource';
import TypeNav from '../TypeNav';
import { RoutedAgentItemsProps } from '../types';

import './index.scss';

const getRenderList = (data: Item[], type: string, keywords: string) => {
  if (type === 'All') {
    return data.filter(item => item.name.includes(keywords));
  }

  return data.filter(
    item =>
      item.type.toLocaleLowerCase() === type.toLocaleLowerCase() &&
      item.name.includes(keywords)
  );
};

const List = withRouter((props: RoutedAgentItemsProps) => {
  const noticeDispatch = useNoticeDispatch();
  const agentsDispatch = useAgentsDispatch();

  const typeNameList = getAgentTypeList(props.data).map(item =>
    titleCase(item.name)
  );
  const { type = 'All', keywords = '' } = queryString.parse(
    props.location.search
  );
  const renderList = getRenderList(
    props.data,
    type as string,
    keywords as string
  );

  const handleDeleteResource = (item: Item, index: number) => () => {
    const newItem = {
      ...item,
      resources: item.resources.filter((_, i) => i !== index)
    };
    request(
      {
        noticeDispatch,
        apiPath: 'agents/modify',
        callBack: () => {
          agentsDispatch({
            type: 'DELETE_RESOURCES',
            payload: {
              id: item.id,
              data: index
            }
          });
        }
      },
      newItem
    );
  };
  const handleNewResource = (item: Item) => () => {
    noticeDispatch({
      type: 'NEW_RESOURCE',
      payload: item.id
    });
  };

  return (
    <div className={cx(props.className, 'agentList')}>
      <TypeNav data={typeNameList} />
      <ul>
        {!renderList.length && <p>没有任何数据！</p>}
        {renderList.map(item => {
          const status = item.status.toLocaleLowerCase();

          return (
            <li className="agentList-item" key={item.id}>
              <img
                className="agentList-itemImg"
                src={osImg[item.os]}
                alt={item.os}
              />
              <div className="agentList-itemContent">
                <div className="agentList-itemOption">
                  <div className="agentList-itemNameWrap">
                    <i className="icon-desktop" />
                    <span className="agentList-itemName">{item.name}</span>
                    <span
                      className={cx('agentList-itemStatus', {
                        green: status === 'idle',
                        yellow: status === 'building'
                      })}
                    >
                      {status}
                    </span>
                  </div>
                  <ul className="agentList-itemOther">
                    <li>
                      <i className="icon-info" />
                      <span>{item.ip}</span>
                    </li>
                    <li>
                      <i className="icon-folder" />
                      <span>{item.location}</span>
                    </li>
                  </ul>
                </div>
                <div className="agentList-itemOption">
                  <div className="agentList-itemResource">
                    <button
                      onClick={handleNewResource(item)}
                      className="agentList-itemResourceNew"
                    >
                      <i className="icon-plus" />
                    </button>
                    <ul className="agentList-itemResourceList">
                      {item.resources.map((resource, index) => (
                        <li className="agentList-itemResourceItem" key={index}>
                          <span>{resource}</span>
                          <i
                            onClick={handleDeleteResource(item, index)}
                            className="icon-trash"
                          />
                        </li>
                      ))}
                    </ul>
                    <NewResource
                      data={item}
                      className="agentList-newResource"
                    />
                  </div>
                  {status === 'building' && (
                    <button className="agentList-itemResourceDeny">
                      <i className="icon-deny" />
                      <span>Deny</span>
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default List;
