<template>
  <div class="warnning">
    {{ message }}
  </div>
</template>

<script>
  export default {
    name: 'OaDealTask',
    data() {
      return {
        redirect: null,
        message: '系统跳转中',
        flowId: '',
        flowType: '',
        busiId: ''
      };
    },
    created() {
      this.flowId = this.$route.query.flowId;
      this.flowType = this.$route.query.flowType;
      if (this.flowId === undefined || this.flowId === '') {
        this.message = '待办参数缺失';
        this.$commonUtil.messageBox.error('', '', '待办参数缺失！');
        return;
      }
      if (this.flowType === undefined || this.flowType === '') {
        this.message = '待办参数缺失';
        this.$commonUtil.messageBox.error('', '', '待办参数缺失！');
        return;
      }
      this.busiId = this.$route.query.busiId;
      if (this.busiId === undefined || this.busiId === '') {
        this.message = '已办参数缺失';
        this.$commonUtil.messageBox.error('', '', '已办参数缺失！');
        return;
      }
      this.queryFlowInfo();
    },
    mounted() {
    },
    methods: {
      // 根据流程类型选择不同的查询待办方法
      queryFlowInfo() {
        switch (this.flowType) {
          case 'SJ':
            this.qrySaleOppAgency();
            break;
          case 'ZC':
            this.qrySaleSupportAgency();
            break;
          case 'DT':
            this.qryDocTransferTask();
            break;
          case 'JC':
            this.getBdmTaskInfoList();
            break;
          case 'PB':
            this.qryProjectBiddingAgencyList();
            break;
          case 'PA':
            this.qrySaleProjectApplyAgencyList();
            break;
          case 'ER':
            this.projectPreparationItemsList();
            break;
          case 'XMGD':
            this.qryProjectCloseTaskList();
            break;
          case 'SC':
            this.qryConstructionSaleQryList();
            break;
          case 'FMM':
            this.qryFaultMngTask();
            break;
          case 'PG':
            this.qryPostAssessmentTaskList();
            break;
          case 'ITBA':
            this.queryItBusinessAcceptanceTaskList();
            break;
          case 'CTBA':
            this.queryCtBusinessAcceptanceTaskList();
            break;
          case 'SPA':
            this.queryProvisionApplyTaskList();
            break;
          default:
            this.queryNewToDoTaskList();
            break;
          // this.message = '待办参数错误';
          // this.$commonUtil.messageBox.error('', '', '待办参数错误！');
          // break;
        }
      },
      // 查询商机待办并跳转对应页面
      qrySaleOppAgency() {
        const inParam = {
          flowId: this.flowId,
          executor_staff: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qrySaleOppAgency, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                FLOW_ID: this.flowId
              };
              // 商机已办根据flow_id查询新opp_id
              this.$post(this.saleCenterIctApi.saleOpp.querySaleOppIdByFlowId, {
                ...inParam
              }).then((r) => {
                if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                  this.$commonUtil.messageBox.error(
                    '',
                    r.data.ROOT.BODY.RETURN_CODE,
                    r.data.ROOT.BODY.DETAIL_MSG
                  );
                  return;
                }
                this.busiId = r.data.ROOT.BODY.OUT_DATA;
                window.location.href =
                  '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?sale_opp_id=' +
                  this.busiId +
                  '&module=oppInfo';
                return;
              });
            }
            var url = '';
            if (data.exec_result === '10') {
              // 查阅
              url =
                '/salewebIct/apps/serviceapps/oppMgt/openOppInfoConsultDetails.html?order_id=' +
                data.order_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&module=oppInfo';
            } else {
              // 处理
              url =
                '/salewebIct/apps/serviceapps/oppMgt/openOppInfoAgencyDetails.html?order_id=' +
                data.order_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&module=oppInfo';
            }
            window.location.href = url;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询售前支撑待办并跳转对应页面
      qrySaleSupportAgency() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qrySaleSupportAgency, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                SUPPORT_ID: this.busiId,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.querySaleSupportInfoList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error(
                      '',
                      '',
                      '售前支撑单查询失败'
                    );
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?SUPPORT_ID=' +
                    this.busiId +
                    '&sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&BDM_ID=&module=support';
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            var url = '';
            if (data.exec_result === '01' || data.exec_result === '15') {
              // 转售前支撑审批  15：待指派
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportInfoAgencyDetails.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&exec_result=' +
                data.exec_result +
                '&order_type=' +
                data.order_type +
                '&module=support';
            } else if (
              data.exec_result === '05' ||
              data.exec_result === '11' ||
              data.exec_result === '14'
            ) {
              // 后续审批 5：会审待审11：中止待审14：驻点审批
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportInfoAgency2Details.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&exec_result=' +
                data.exec_result +
                '&order_type=' +
                data.order_type +
                '&module=support';
            } else if (data.exec_result === '07') {
              // 转立项报备
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportInfoTrunProjectAgencyDetails.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&order_type=' +
                data.order_type +
                '&module=support';
            } else if (data.exec_result === '12' || data.exec_result === '99') {
              // 查阅
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportInfoConsultDetails.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&order_type=' +
                data.order_type +
                '&module=support' +
                '&exec_result=' +
                data.exec_result;
            } else if (
              data.flow_tache_id === 'SUPPORT65' ||
              data.flow_tache_id === 'SUPPORT66'
            ) {
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportCoalesceCloudEstimate.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&order_type=' +
                data.order_type +
                '&module=support';
            } else {
              url =
                '/salewebIct/apps/serviceapps/preSaleSupport/openSupportInfoDaiBanDetails.html?order_id=' +
                data.order_id +
                '&SUPPORT_ID=' +
                data.support_id +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&flow_tache_id=' +
                data.flow_tache_id +
                '&rule_id=' +
                data.rule_id +
                '&order_type=' +
                data.order_type +
                '&module=support';
            }
            window.location.href = url;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询资料交底待办
      qryDocTransferTask() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qryDocTransferTask, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TRANSFER_TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                DOC_TRANSFER_ID: this.busiId,
                LOGIN_NO: this.$store.getters.systemUserCode,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(this.saleCenterIctApi.detailInfo.qryDocTransferInfo, {
                ...inParam
              })
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.TRANSFER_TASK_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '资料交底查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?support_id=' +
                    data.support_id +
                    '&sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&doc_transfer_id=' +
                    data.DOC_TRANSFER_ID +
                    '&tache_id=' +
                    data.FLOW_TACHE_ID +
                    '&flow_id=' +
                    data.FLOW_ID +
                    '&module=support&supportModule=docTransfer&flag=1';
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/docTransfer/docTransferDealSpace.html?support_id' +
              data.SUPPORT_ID +
              '&sale_opp_id=' +
              data.SALE_OPP_ID +
              '&doc_transfer_id=' +
              data.DOC_TRANSFER_ID +
              '&tache_id=' +
              data.FLOW_TACHE_ID +
              '&flow_id=' +
              data.FLOW_ID +
              '&module=support&supportModule=docTransfer';
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询项目预审待办
      getBdmTaskInfoList() {
        const inParam = {
          flowId: this.flowId,
          LOGIN_NO: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.getBdmTaskInfoList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                BDM_ID: this.busiId,
                LOGIN_NO: this.$store.getters.systemUserCode,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(this.saleCenterIctApi.detailInfo.getBdmInfoList, {
                ...inParam
              })
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.BDM_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '资料交底查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/clueOption/clueOptionDetail.html?module=clueOption&BDM_ID=' +
                    data.BDM_ID +
                    '&sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            var url = '';
            if (data.STATUS === '01') {
              url =
                '/salewebIct/apps/serviceapps/clueOption/clueOptionModify.html?module=clueOption&BDM_ID=' +
                data.BDM_ID +
                '&sale_opp_id=' +
                data.SALE_OPP_ID +
                '&FLOW_TACHE_ID=' +
                data.FLOW_TACHE_ID +
                '&FLOW_ID=' +
                data.FLOW_ID +
                '&RULE_ID=' +
                data.RULE_ID +
                '&PREDICT_SCORE=' +
                data.PREDICT_SCORE +
                '&PROJECT_ID=' +
                data.PROJECT_ID;
            } else {
              url =
                '/salewebIct/apps/serviceapps/clueOption/clueOptionApproval.html?module=clueOption&BDM_ID=' +
                data.BDM_ID +
                '&sale_opp_id=' +
                data.SALE_OPP_ID +
                '&FLOW_TACHE_ID=' +
                data.FLOW_TACHE_ID +
                '&FLOW_ID=' +
                data.FLOW_ID +
                '&RULE_ID=' +
                data.RULE_ID +
                '&PREDICT_SCORE=' +
                data.PREDICT_SCORE +
                '&PROJECT_ID=' +
                data.PROJECT_ID;
            }
            window.location.href = url;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询项目招投标待办
      qryProjectBiddingAgencyList() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qryProjectBiddingAgencyList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.PROJECT_BIDD_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                BIDDING_ID: this.busiId,
                EXECUTOR_STAFF: this.$store.getters.systemUserCode,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.qryProjectBiddingQueryList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.BID_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error(
                      '',
                      '',
                      '项目招投标查询失败'
                    );
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&flow_proinst_id=' +
                    data.FLOW_PROINST_ID +
                    '&module=protectBidd' +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/projectBidd/biddAgencySpace.html?sale_opp_id=' +
              data.SALE_OPP_ID +
              '&flow_tache_id=' +
              data.FLOW_TACHE_ID +
              '&flow_id=' +
              data.FLOW_ID +
              '&flow_proinst_id=' +
              data.FLOW_PROINST_ID +
              '&module=protectBidd' +
              '&PROJECT_ID=' +
              data.PROJECT_ID;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询立项申请待办
      qrySaleProjectApplyAgencyList() {
        const inParam = {
          FLOW_ID: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qrySaleProjectApplyAgencyList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.DATA_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                PROJECT_APPLY_ID: this.busiId,
                EXECUTOR_STAFF: this.$store.getters.systemUserCode,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.qryProjectApplyQueryList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.DATA_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '立项申请查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?sale_opp_id=' +
                    data.sale_opp_id +
                    '&PROJECT_APPLY_ID=' +
                    data.PROJECT_APPLY_ID +
                    '&module=projectApply' +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/projectApply/html/projectApplyDealSpace.html?sale_opp_id=' +
              data.SALE_OPP_ID +
              '&SUPPORT_ID=' +
              data.SUPPORT_ID +
              '&apply_person=' +
              data.apply_person +
              '&PROJECT_APPLY_ID=' +
              data.PROJECT_APPLY_ID +
              '&tache_id=' +
              data.FLOW_TACHE_ID +
              '&region_code=' +
              data.REGION_CODE +
              '&flow_id=' +
              data.FLOW_ID +
              '&module=projectApply' +
              '&PROJECT_ID=' +
              data.PROJECT_ID;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询项目立项待办
      projectPreparationItemsList() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.projectPreparationItemsList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.sale_project;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                PROJECT_ID: this.busiId,
                EXECUTOR_STAFF: this.$store.getters.systemUserCode,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.projectPreparationQryList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.sale_project;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '立项待办查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?PROJECT_ID=' +
                    data.PROJECT_ID +
                    '&sale_opp_id=' +
                    data.sale_opp_id +
                    '&type_flag=&module=project';
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/projectPrepare/projectPrepareItems/detil.html?PROJECT_ID=' +
              data.PROJECT_ID +
              '&sale_opp_id=' +
              data.sale_opp_id +
              '&module=project';
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询项目归档已办
      qryProjectCloseTaskList() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qryProjectCloseTaskList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                SUBJECT_ID: this.busiId,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.qryProjectCloseTaskList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '项目归档查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?&sale_opp_id=' +
                    data.sale_opp_id +
                    '&module=project' +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/projectClose/openProjectCloseDetails.html?flow_id=' +
              data.FLOW_ID +
              '&subject_id=' +
              data.SUBJECT_ID +
              '&project_id=' +
              data.PROJECT_ID +
              '&PROJECT_ID=' +
              data.PROJECT_ID;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
          });
      },
      // 查询售中项目实施已办
      qryConstructionSaleQryList() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qryConstructionSaleQryList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.SALE_BUILD;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                BUILD_ID: this.busiId,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(
                this.saleCenterIctApi.detailInfo.qryConstructionSaleItemsList,
                {
                  ...inParam
                }
              )
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.SALE_BUILD;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '售中建设查询失败');
                    return;
                  }

                  const data = dataList[0];

                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?build_id=' +
                    data.build_id +
                    '&sale_opp_id=' +
                    data.sale_opp_id +
                    '&project_id=' +
                    data.PROJECT_ID +
                    '&module=build&buildModule=basicMsg' +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            var url = '';
            if (
              data.STATUS_CD === '1' &&
              data.FLOW_TACHE_ID !== null &&
              data.FLOW_TACHE_ID !== 'BUILD16'
            ) {
              url =
                '/salewebIct/apps/serviceapps/constsale/saleconstitems/exam.html?build_id=' +
                data.build_id +
                '&ict_number=' +
                data.ict_number +
                '&ORDER_ID=' +
                data.ORDER_ID +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&current_tache_id=' +
                data.NEXT_PLAN +
                '&project_id=' +
                data.project_id +
                '&module=build&buildModule=basicMsg' +
                '&PROJECT_ID=' +
                data.project_id;
            } else if (data.STATUS_CD === '3') {
              url =
                '/salewebIct/apps/serviceapps/constsale/saleconstitems/read.html?build_id=' +
                data.build_id +
                '&ict_number=' +
                data.ict_number +
                '&ORDER_ID=' +
                data.ORDER_ID +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&project_id=' +
                data.project_id +
                '&module=build&buildModule=basicMsg' +
                '&PROJECT_ID=' +
                data.project_id;
            } else if (data.STATUS_CD === '01' && data.build_status_cd === '') {
              url =
                '/salewebIct/apps/serviceapps/constsale/saleconstitems/exam.html?build_id=' +
                data.build_id +
                '&ict_number=' +
                data.ict_number +
                '&design_id' +
                data.ORDER_ID +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&tache_id=' +
                data.FLOW_TACHE_ID +
                '&flow_id=' +
                data.FLOW_ID +
                '&current_tache_id=' +
                data.NEXT_PLAN +
                '&project_id=' +
                data.project_id +
                '&module=build&buildModule=basicMsg' +
                '&PROJECT_ID=' +
                data.project_id;
            } else if (data.STATUS_CD === 'E1') {
              url =
                '/salewebIct/apps/serviceapps/constsale/saleconstitems/exam.html?build_id=' +
                data.build_id +
                '&ict_number=' +
                data.ict_number +
                '&co_id=' +
                data.FLOW_ID +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&tache_id=' +
                data.FLOW_TACHE_ID +
                '&flow_id=' +
                data.FLOW_ID +
                '&current_tache_id=' +
                data.FLOW_TACHE_ID +
                '&partner_id=' +
                data.ORDER_ID +
                '&project_id=' +
                data.project_id +
                '&module=build&buildModule=basicMsg' +
                '&PROJECT_ID=' +
                data.project_id;
            } else if (data.STATUS_CD === '11001') {
              url =
                '/salewebIct/apps/serviceapps/constsale/saleconstitems/infoSecureUpload.html?build_id=' +
                data.build_id +
                '&ict_number=' +
                data.ict_number +
                '&sale_opp_id=' +
                data.sale_opp_id +
                '&current_tache_id=' +
                data.NEXT_PLAN +
                '&rule_id=1&order_id=' +
                data.ORDER_ID +
                '&project_id=' +
                data.project_id +
                '&module=build&buildModule=basicMsg&ict_number=' +
                data.ict_number +
                '&PROJECT_ID=' +
                data.project_id;
            }
            if (url === '') {
              this.message = '待办信息错误';
              this.$commonUtil.messageBox.error('', '', '待办信息错误！');
              return false;
            }
            window.location.href = url;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询故障管理已办
      qryFaultMngTask() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.faultmng.qryFaultMngTask, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.FAULT_TASK_LIST;
            const data = dataList[0];
            if (!this.checkDataList(dataList)) {
              const inParam = {
                FAULT_ID: this.busiId,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(this.saleCenterIctApi.detailInfo.qryFaultManageInfo, {
                ...inParam
              })
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.FAULT_TASK_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '故障管理查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&build_id=' +
                    data.BUILD_ID +
                    '&launch_id=' +
                    data.LAUNCH_ID +
                    '&fault_id=' +
                    data.FAULT_ID +
                    '&tache_id=' +
                    data.FLOW_TACHE_ID +
                    '&flow_id=' +
                    data.FLOW_ID +
                    '&project_id=' +
                    data.PROJECT_ID +
                    '&module=protectInfo&protectModule=faultManage&flag=1' +
                    '&PROJECT_ID=' +
                    data.PROJECT_ID;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            window.location.href =
              '/salewebIct/apps/serviceapps/faultManage/faultToDo/faultDealSpace.html?sale_opp_id=' +
              data.SALE_OPP_ID +
              '&build_id=' +
              data.BUILD_ID +
              '&launch_id=' +
              data.LAUNCH_ID +
              '&fault_id=' +
              data.FAULT_ID +
              '&tache_id=' +
              data.FLOW_TACHE_ID +
              '&flow_id=' +
              data.FLOW_ID +
              '&project_id=' +
              data.PROJECT_ID +
              '&module=protectInfo&protectModule=faultManage' +
              '&PROJECT_ID=' +
              data.PROJECT_ID;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询后评估已办
      qryPostAssessmentTaskList() {
        const inParam = {
          flowId: this.flowId,
          EXECUTOR_STAFF: this.$store.getters.systemUserCode,
          PAGE_NUM: 1,
          PAGE_SIZE: 10
        };
        this.$post(this.saleCenterIctApi.flowTask.qryPostAssessmentTaskList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.TASK_LIST;
            if (!this.checkDataList(dataList)) {
              const inParam = {
                ID: this.busiId,
                PAGE_NUM: 1,
                PAGE_SIZE: 10
              };
              this.$post(this.saleCenterIctApi.detailInfo.qryPostAssessmentMsg, {
                ...inParam
              })
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.MSG_LIST;
                  if (dataList.length === 0) {
                    this.$commonUtil.messageBox.error('', '', '后评估查询失败');
                    return;
                  }
                  const data = dataList[0];
                  window.location.href =
                    '/salewebIct/apps/serviceapps/common/buidlSaleDetail.html?pa_id=' +
                    data.ID +
                    '&build_id=' +
                    data.BUILD_ID +
                    '&sale_opp_id=' +
                    data.SALE_OPP_ID +
                    '&pa_type=' +
                    data.TYPE +
                    '&module=passessment&project_id=' +
                    data.project_id +
                    '&PROJECT_ID=' +
                    data.project_id;
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转已办详情失败');
                });
              return;
            }
            const data = dataList[0];
            window.location.href =
              '/salewebIct/apps/serviceapps/postAssessment/postAssessmentDealSpace.html?build_id=' +
              data.BUILD_ID +
              '&sale_opp_id=' +
              data.SALE_OPP_ID +
              '&pa_id=' +
              data.ID +
              '&pa_tache_id=' +
              data.FLOW_TACHE_ID +
              '&pa_task_id=' +
              data.FLOW_ID +
              '&pa_type=' +
              data.TYPE +
              '&module=passessment&project_id=' +
              data.project_id +
              '&PROJECT_ID=' +
              data.project_id;
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询IT类业务受理待办
      queryItBusinessAcceptanceTaskList() {
        const inParam = {
          BUSI_INFO: {
            FLOW_ID: this.flowId,
            BUSINESS_TYPE: '10',
            STAFF_CODE: this.$store.getters.systemUserCode
          },
          PAGE_INFO: {
            PAGE_NUM: 1,
            PAGE_SIZE: 5
          }
        };
        this.$post(this.saleCenterApi.businessAcceptance.queryBusinessAcceptanceTaskList,
          {
            ...inParam
          }
        ).then((r) => {
          if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
            this.$commonUtil.messageBox.error(
              '',
              r.data.ROOT.BODY.RETURN_CODE,
              r.data.ROOT.BODY.DETAIL_MSG
            );
            return;
          }
          const dataList = r.data.ROOT.BODY.OUT_DATA.OUT_PARAM;
          if (!this.checkDataList(dataList)) {
            // 跳转IT业务受理待办查看页面
            const query = {
              fundaccId: this.busiId
            };
            this.$router.push({
              path: '/saleCenter/businessAcceptance/itBusinessAcceptanceTaskInfo',
              query: {
                info: this.$commonUtil.encodeQuery(query)
              }
            });
            return;
          }
          // 跳转IT业务受理待办处理页面
          const data = dataList[0];
          const query = {
            fundaccId: data.FUNDACC_ID
          };
          this.$router.push({
            path: '/saleCenter/businessAcceptance/dealItBusinessAcceptanceTask',
            query: {
              info: this.$commonUtil.encodeQuery(query)
            }
          });
        })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询CT类业务受理待办
      queryCtBusinessAcceptanceTaskList() {
        const inParam = {
          BUSI_INFO: {
            FLOW_ID: this.flowId,
            BUSINESS_TYPE: '11',
            STAFF_CODE: this.$store.getters.systemUserCode
          },
          PAGE_INFO: {
            PAGE_NUM: 1,
            PAGE_SIZE: 5
          }
        };
        this.$post(
          this.saleCenterApi.businessAcceptance.queryBusinessAcceptanceTaskList,
          {
            ...inParam
          }
        )
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.OUT_PARAM;
            if (!this.checkDataList(dataList)) {
              // 跳转CT业务受理待办查看页面
              const query = {
                fundaccId: this.busiId
              };
              this.$router.push({
                path: '/saleCenter/businessAcceptance/ctBusinessAcceptanceTaskInfo',
                query: {
                  info: this.$commonUtil.encodeQuery(query)
                }
              });
              return;
            }
            // 跳转CT业务受理待办处理页面
            const data = dataList[0];
            const query = {
              fundaccId: data.FUNDACC_ID
            };
            this.$router.push({
              path: '/saleCenter/businessAcceptance/dealCtBusinessAcceptanceTask',
              query: {
                info: this.$commonUtil.encodeQuery(query)
              }
            });
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 查询计提申请待办
      queryProvisionApplyTaskList() {
        const inParam = {
          BUSI_INFO: {
            FLOW_ID: this.flowId,
            STAFF_CODE: this.$store.getters.systemUserCode
          },
          PAGE_INFO: {
            PAGE_NUM: 1,
            PAGE_SIZE: 5
          }
        };
        this.$post(this.saleCenterApi.reimbursement.queryProvisionApplyTaskList, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.OUT_PARAM;
            if (!this.checkDataList(dataList)) {
              // 跳转计提申请待办查看页面
              const query = {
                contractId: this.busiId
              };
              this.$router.push({
                path: '/saleCenter/reimbursement/showProvisionInfo',
                query: {
                  info: this.$commonUtil.encodeQuery(query)
                }
              });
              return;
            }
            // 跳转计提申请待办处理页面
            const data = dataList[0];
            const query = {
              contractId: data.CONTRACT_ID,
              flowId: this.flowId
            };
            this.$router.push({
              path: '/saleCenter/reimbursement/dealProvisionApplyTask',
              query: {
                info: this.$commonUtil.encodeQuery(query)
              }
            });
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      },
      // 校验查询出的待办列表
      checkDataList(dataList) {
        if (
          dataList === undefined ||
          !(dataList instanceof Array) ||
          dataList.length > 1
        ) {
          this.message = '待办参数错误';
          this.$commonUtil.messageBox.error('', '', '待办参数错误！');
          return false;
        }
        if (dataList.length === 0) {
          this.message = '待办已完成';
          // 给emis发送关闭待办请求，无论成功或失败，什么都不做
          const inParam = {
            flowId: this.flowId,
            executorStaff: this.$store.getters.systemUserCode
          };
          this.$post(this.saleCenterIctApi.flowTask.closeEmisTaskService, {
            ...inParam
          });
          // this.$commonUtil.messageBox.error('', '', '待办已完成！', () => {
          //   window.close();
          // });
          return false;
        }
        return true;
      },
      // 查询新流程待办
      queryNewToDoTaskList() {
        const inParam = {
          BUSI_INFO: {
            SERIAL_NO: this.flowId,
            TASK_STATUS: '02',
            STAFF_CODE: this.$store.getters.systemUserCode
          }
        };
        this.$post(this.saleCenterIctApi.flowTask.queryTaskInfoBySerialNo, {
          ...inParam
        })
          .then((r) => {
            if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
              this.$commonUtil.messageBox.error(
                '',
                r.data.ROOT.BODY.RETURN_CODE,
                r.data.ROOT.BODY.DETAIL_MSG
              );
              return;
            }
            const dataList = r.data.ROOT.BODY.OUT_DATA.OUT_PARAM;
            if (!this.checkDataList(dataList)) {
              // 跳转待办查看页面
              const inParam = {
                BUSI_INFO: {
                  SERIAL_NO: this.flowId,
                  TASK_STATUS: '03',
                  STAFF_CODE: this.$store.getters.systemUserCode
                }
              };
              this.$post(this.saleCenterIctApi.flowTask.queryTaskInfoBySerialNo, {
                ...inParam
              })
                .then((r) => {
                  if (r.data.ROOT.BODY.RETURN_CODE !== '0') {
                    this.$commonUtil.messageBox.error(
                      '',
                      r.data.ROOT.BODY.RETURN_CODE,
                      r.data.ROOT.BODY.DETAIL_MSG
                    );
                    return;
                  }
                  const dataList = r.data.ROOT.BODY.OUT_DATA.OUT_PARAM;
                  if (!this.checkDataList(dataList)) {
                    this.$commonUtil.messageBox.error('', '', '跳转失败');
                    return;
                  }
                  // 跳转已办处理页面
                  const data = dataList[0];
                  const query = {};
                  query.flowSerialNo = data.SERIAL_NO;
                  query.flowSaleOppId = data.SALE_OPP_ID;
                  query.flowBusiId = data.BUSI_ID;
                  query.flowBusiType = data.BUSI_TYPE;
                  query.flowIsReadTask = data.IS_READ_TASK;
                  query.flowTacheId = data.FLOW_TACHE_ID;
                  query.flowProjectId = data.PROJECT_ID;
                  if (data.TARGET_URL.indexOf('salewebIct') === -1) {
                    var dataInfo = {};
                    dataInfo.busiId = this.busiId;
                    dataInfo.flowSerialNo = data.SERIAL_NO;
                    dataInfo.hideButton = true;
                    var info = this.$commonUtil.encodeQuery(dataInfo);
                    query.info = info;
                  }
                  this.$router.push({
                    path: data.TARGET_URL,
                    query: query
                  });
                })
                .catch((e) => {
                  this.$commonUtil.messageBox.error('', '', '跳转失败');
                });
            }
            // 跳转待办处理页面
            const data = dataList[0];
            const query = {};
            query.flowSerialNo = data.SERIAL_NO;
            query.flowSaleOppId = data.SALE_OPP_ID;
            query.flowBusiId = data.BUSI_ID;
            query.flowBusiType = data.BUSI_TYPE;
            query.flowIsReadTask = data.IS_READ_TASK;
            query.flowTacheId = data.FLOW_TACHE_ID;
            query.flowProjectId = data.PROJECT_ID;
            if (data.TARGET_URL.indexOf('salewebIct') === -1) {
              var dataInfo = {};
              dataInfo.flowSerialNo = data.SERIAL_NO;
              dataInfo.flowSaleOppId = data.SALE_OPP_ID;
              dataInfo.flowBusiId = data.BUSI_ID;
              dataInfo.flowBusiType = data.BUSI_TYPE;
              dataInfo.flowIsReadTask = data.IS_READ_TASK;
              dataInfo.flowTacheId = data.FLOW_TACHE_ID;
              dataInfo.flowProjectId = data.PROJECT_ID;
              dataInfo.busiId = this.busiId;
              dataInfo.hideButton = true;
              var info = this.$commonUtil.encodeQuery(dataInfo);
              query.info = info;
            }
            this.$router.push({
              path: data.TARGET_URL,
              query: query
            });
          })
          .catch((e) => {
            this.$commonUtil.messageBox.error('', '', '跳转失败');
          });
      }
    }
  };
</script>

<style scoped>
  .warnning {
    color: #ff0000;
  }
</style>
