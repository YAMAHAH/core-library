using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using DataService;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;
using Microsoft.EntityFrameworkCore;

namespace dataservices.Services.ReportService
{
    public class ReportService : ServiceBase, IReportService
    {
        public ReportService() : base(null) { }

        public ReportService(IUnitOfWork unitOfWork, bool shareTransaction = false)
        : base(unitOfWork, shareTransaction)
        {
        }

        private static long GuidToLongId()
        {
            byte[] buffer = Guid.NewGuid().ToByteArray();
            return BitConverter.ToInt64(buffer, 0);
        }

        public ResponseMessage<ReportViewModel> CreateOrUpdateRootReport(RequestMessage<ReportViewModel> reqMsg)
        {
            try
            {
                var rptViewModel = reqMsg.Playload.FirstOrDefault();

                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<ReportViewModel, Report>();
                    cfg.CreateMap<Report, ReportViewModel>();
                });

                Func<Report, Report> getNewNode = rpt => new Report()
                {
                    Parent = rpt,
                    ParentId = rpt.ReportId,
                    RootId = rpt.RootId
                };
                Action<Report, Report> getConfig = (rpt1, rpt2) =>
                {
                    rpt2.ReportId = rpt1.ReportId;
                    rpt2.RootId = rpt1.RootId;
                };
                Func<Report, Report, bool> getKey = (rpt1, rpt2) => rpt1.ReportId == rpt2.ReportId;
                Func<Report, List<Report>> getChilds = rpt => rpt.Childs;
                Func<Report, int> getCompareKey = rpt => rpt.ReportId;

                var nowReport = Mapper.Map<ReportViewModel, Report>(rptViewModel);

                if (nowReport.ReportId <= 0)
                {
                    var existRpt = new Report() { Parent = null, ParentId = null };
                    UnitOfWork.InsertEntity(existRpt);
                    existRpt.RootId = existRpt.ReportId;
                    UnitOfWork.AddNodeValues(existRpt, nowReport, getChilds, getNewNode, getConfig);
                    nowReport = existRpt;
                }
                else
                {
                    var existReportList = UnitOfWork.EntitySet<Report>()
                    .Where(r => r.RootId == rptViewModel.ReportId)
                    .ToList();
                    var existReport = existReportList.FirstOrDefault(r => r.ReportId == rptViewModel.ReportId && r.ParentId == null);
                    nowReport.Parent = null;
                    nowReport.ParentId = null;
                    UnitOfWork.UpdateNodeValues(existReport, nowReport, getChilds, getCompareKey, getKey, getNewNode, getConfig);
                    nowReport = existReport;
                }
                CalaOrder(nowReport);
                UnitOfWork.AcceptAllChanges();
                if (nowReport.RootId < 0)
                {
                    // var retCount = UnitOfWork.ExecuteSqlCommand("update Reports set RootId = {1} where RootId ={0}", nowReport.RootId, nowReport.ReportId);
                    UnitOfWork.UpdateLocalNodeValues(nowReport, (nd) => nd.Childs, (nd) => nd.RootId = nowReport.ReportId);
                    UnitOfWork.AcceptAllChanges();
                }
                return okResponse(Mapper.Map<Report, ReportViewModel>(nowReport));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                // return BadResponse(reqMsg.Playload.FirstOrDefault());
            }
            return BadResponse(new ReportViewModel());

        }

        public ResponseMessage<ReportViewModel> CreateOrUpdateReport(RequestMessage<ReportViewModel> reqMsg)
        {
            try
            {
                var rptViewModel = reqMsg.Playload.FirstOrDefault();
                if (rptViewModel.ParentId == null || rptViewModel.RootId <= 0)
                {
                    return BadResponse(rptViewModel);
                }

                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<ReportViewModel, Report>();
                    cfg.CreateMap<Report, ReportViewModel>();
                });

                Func<Report, Report> getNewNode = rpt => new Report()
                {
                    Parent = rpt,
                    ParentId = rpt.ReportId,
                    RootId = rpt.RootId
                };
                Action<Report, Report> getConfig = (rpt1, rpt2) =>
                {
                    rpt2.ReportId = rpt1.ReportId;
                    rpt2.RootId = rpt1.RootId;
                };
                Func<Report, Report, bool> getKey = (rpt1, rpt2) => rpt1.ReportId == rpt2.ReportId;
                Func<Report, List<Report>> getChilds = rpt => rpt.Childs;
                Func<Report, int> getCompareKey = rpt => rpt.ReportId;

                var nowReport = Mapper.Map<ReportViewModel, Report>(rptViewModel);

                if (nowReport.ReportId <= 0)
                {
                    var existRpt = new Report() { Parent = nowReport.Parent, ParentId = nowReport.Parent.ParentId, RootId = nowReport.RootId };
                    UnitOfWork.InsertEntity(existRpt);
                    UnitOfWork.AddNodeValues(existRpt, nowReport, getChilds, getNewNode, getConfig);
                    nowReport = existRpt;
                }
                else
                {
                    var existReportList = UnitOfWork.EntitySet<Report>()
                    .FromSql("CALL getTreeNodes({0},{1})", rptViewModel.ReportId, rptViewModel.RootId)
                    .ToList();
                    var existReport = existReportList.FirstOrDefault(r => r.ReportId == rptViewModel.ReportId);
                    UnitOfWork.UpdateNodeValues(existReport, nowReport, getChilds, getCompareKey, getKey, getNewNode, getConfig);
                    nowReport = existReport;
                }
                UnitOfWork.AcceptAllChanges();
                updateNodeOrder(nowReport.RootId, nowReport.RootId);
                return okResponse(Mapper.Map<Report, ReportViewModel>(nowReport));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                // return BadResponse(reqMsg.Playload.FirstOrDefault());
            }
            return BadResponse(new ReportViewModel());
        }

        private void updateNodeOrder(int nodeId, int rootId)
        {
            var allNodes = UnitOfWork.EntitySet<Report>()
                   .FromSql("CALL getTreeNodes({0},{1})", nodeId, rootId)
                   .ToList();
            var rootNode = allNodes.Find(nd => nd.ReportId == nodeId);
            if (rootNode != null)
            {
                CalaOrder(rootNode);
                UnitOfWork.AcceptAllChanges();
            }
        }
        public ResponseMessage<ReportViewModel> GetReport(RequestMessage<ReportViewModel> reqMsg)
        {
            var rptViewModel = reqMsg.Playload.FirstOrDefault();
            Mapper.Initialize(cfg =>
              {
                  cfg.CreateMap<ReportViewModel, Report>();
                  cfg.CreateMap<Report, ReportViewModel>();
              });

            //  if (rptViewModel.ReportId > 0)
            //  {
            // rpt = UnitOfWork.EntitySet<Report>().Find(rptViewModel.ReportId);
            var rpt = UnitOfWork.EntitySet<Report>()
            .FromSql("CALL getTreeNodes({0},{1})", rptViewModel.ReportId, rptViewModel.RootId)
            // .Where(r => r.RootId == rptViewModel.ReportId)
            .ToList();

            // }
            // UnitOfWork.GetTreeNodes(rpt, r => r.Childs, r => r.Childs);
            CalaOrder(rpt.FirstOrDefault(r => r.ReportId == rptViewModel.ReportId));
            var result = Mapper.Map<ReportViewModel>(rpt.FirstOrDefault(r => r.ReportId == rptViewModel.ReportId));
            Console.WriteLine(GuidToLongId());
            return okResponse(result);
        }
        private NodeOrderInfo CalaOrder(Report node)
        {
            node.Level = 1;
            Action<Report, NodeOrderInfo> headerConfig = (rpt, nodeInfo) =>
          {
              rpt.Ord = nodeInfo.Ord;
              rpt.Lft = nodeInfo.InitNum;
              //if (rpt.Parent == null) rpt.Level = 1;
          };
            Action<Report, Report> middleConfig = (curNode, parentNode) =>
            {
                curNode.Level = parentNode.Level + 1;
            };
            Action<Report, int> footerConfig = (nd, initNum) =>
            {
                nd.Rgt = initNum;
            };

            Func<Report, IEnumerable<Report>> getChilds = (nd) => nd.Childs;
            return UnitOfWork.CalaOrd(node, headerConfig, middleConfig, footerConfig, getChilds, new NodeOrderInfo());
        }
        private int CalaOrd2(Report node, int initNum = 1, int ord = 1)
        {
            node.Ord = ord;
            node.Lft = initNum;
            if (node.Parent == null) node.Level = 1;
            node.Childs.ForEach(nd =>
            {
                nd.Level = node.Level + 1;
                ord++;
                initNum++;
                initNum = CalaOrd2(nd, initNum, ord);
            });
            initNum++;
            node.Rgt = initNum;
            return initNum;
        }

        private void UpdateNodeValues<T>(T node, Func<T, List<T>> getChilds, Action<T> setPropertyValue)
        {
            setPropertyValue(node);
            foreach (var child in getChilds(node))
            {
                UpdateNodeValues(child, getChilds, setPropertyValue);
            }
        }

        public ResponseMessage<ReportViewModel> DeleteReport(RequestMessage<ReportViewModel> reqMsg)
        {
            var rptViewModel = reqMsg.Playload.FirstOrDefault();
            var existNodeLists = UnitOfWork?.EntitySet<Report>()
            .FromSql("CALL getTreeNodes({0},{1})", rptViewModel.ReportId, rptViewModel.RootId)
            .ToList();
            var existNode = existNodeLists.Where(r => r.ReportId == rptViewModel.ReportId)
            .FirstOrDefault();
            UnitOfWork.DeleteNode(existNode, (nd) => nd.Childs);
            UnitOfWork.AcceptAllChanges();
            if (rptViewModel.RootId != rptViewModel.ReportId)
            {
                updateNodeOrder(rptViewModel.RootId, rptViewModel.RootId);
                UnitOfWork.AcceptAllChanges();
            }
            return okResponse(rptViewModel);
        }
    }
}