using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using DataService;
using DataService.Infrastructure.UnitOfWork;
using DataService.Models;
using Microsoft.EntityFrameworkCore;

namespace dataservices.Services.ProductService
{
    public class BomManagerService : ServiceBase, IBomManagerService
    {

        public BomManagerService() : base(null) { }

        public BomManagerService(IUnitOfWork unitOfWork, bool shareTransaction = false)
        : base(unitOfWork, shareTransaction)
        {
        }

        private NodeOrderInfo CalaOrder(BomStructure node)
        {
            node.Level = 1;
            node.Total = 1;
            Action<BomStructure, NodeOrderInfo> headerConfig = (rpt, nodeInfo) =>
          {
              rpt.Ord = nodeInfo.Ord;
              rpt.Lft = nodeInfo.InitNum;
          };
            Action<BomStructure, BomStructure> middleConfig = (curNode, parentNode) =>
            {
                curNode.Level = parentNode.Level + 1;
                curNode.Total = parentNode.Total * curNode.SingleTotal;
            };
            Action<BomStructure, int> footerConfig = (nd, initNum) =>
            {
                nd.Rgt = initNum;
            };

            Func<BomStructure, IEnumerable<BomStructure>> getChilds = (nd) => nd.Childs;
            return UnitOfWork.CalaOrd(node, headerConfig, middleConfig, footerConfig, getChilds, new NodeOrderInfo());
        }

        public ResponseMessage<BomNodeViewModel> UpsertBomNode(RequestMessage<BomNodeViewModel> reqMsg)
        {
            try
            {
                var bNodeViewModel = reqMsg.Playload.FirstOrDefault();
                if (bNodeViewModel.ParentId == null || bNodeViewModel.BomStructureId <= 0)
                {
                    return BadResponse(bNodeViewModel);
                }

                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<BomNodeViewModel, BomStructure>();
                    cfg.CreateMap<BomStructure, BomNodeViewModel>();
                });

                Func<BomStructure, BomStructure> getNewNode = bNode => new BomStructure()
                {
                    Parent = bNode,
                    ParentId = bNode.BomStructureId,
                    RootVersionId = bNode.RootVersionId,
                    RootId = bNode.RootId
                };
                Action<BomStructure, BomStructure> getConfig = (bNode1, bNode2) =>
                {
                    bNode2.BomStructureId = bNode1.BomStructureId;
                    bNode2.RootVersionId = bNode1.RootVersionId;
                    bNode2.RootId = bNode1.RootId;
                };
                Func<BomStructure, BomStructure, bool> getKey = (bNode1, bNode2) => bNode1.BomStructureId == bNode2.BomStructureId;
                Func<BomStructure, List<BomStructure>> getChilds = bNode => bNode.Childs;
                Func<BomStructure, int> getCompareKey = bNode => bNode.BomStructureId;

                var nowBomNode = Mapper.Map<BomNodeViewModel, BomStructure>(bNodeViewModel);

                if (nowBomNode.BomStructureId <= 0)
                {
                    var existBNode = new BomStructure()
                    {
                        Parent = nowBomNode.Parent,
                        ParentId = nowBomNode.Parent.ParentId,
                        RootVersionId = nowBomNode.RootVersionId,
                        RootId = nowBomNode.RootId
                    };
                    UnitOfWork.InsertEntity(existBNode);
                    UnitOfWork.AddNodeValues(existBNode, nowBomNode, getChilds, getNewNode, getConfig);
                    nowBomNode = existBNode;
                }
                else
                {
                    var existBomNodeList = UnitOfWork.EntitySet<BomStructure>()
                    .FromSql("CALL getBomNodes({0},{1})", bNodeViewModel.BomStructureId, bNodeViewModel.RootId)
                    .ToList();
                    var existBNode = existBomNodeList.FirstOrDefault(r => r.BomStructureId == bNodeViewModel.BomStructureId);
                    UnitOfWork.UpdateNodeValues(existBNode, nowBomNode, getChilds, getCompareKey, getKey, getNewNode, getConfig);
                    nowBomNode = existBNode;
                }
                UnitOfWork.AcceptAllChanges();
                updateNodeOrder(nowBomNode.RootId, nowBomNode.RootId);
                return okResponse(Mapper.Map<BomStructure, BomNodeViewModel>(nowBomNode));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                // return BadResponse(reqMsg.Playload.FirstOrDefault());
            }
            return BadResponse(new BomNodeViewModel());
        }

        private void updateNodeOrder(int nodeId, int rootId)
        {
            var allNodes = UnitOfWork.EntitySet<BomStructure>()
                   .FromSql("CALL getBomNodes({0},{1})", nodeId, rootId)
                   .ToList();
            var rootNode = allNodes.Find(nd => nd.BomStructureId == nodeId);
            if (rootNode != null)
            {
                CalaOrder(rootNode);
                UnitOfWork.AcceptAllChanges();
            }
        }

        public ResponseMessage<BomNodeViewModel> UpsertRootBomNode(RequestMessage<BomNodeViewModel> reqMsg)
        {
            try
            {
                var bNodeViewModel = reqMsg.Playload.FirstOrDefault();
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<BomNodeViewModel, BomStructure>();
                    cfg.CreateMap<BomStructure, BomNodeViewModel>();
                    cfg.CreateMap<ProductVersion, ProductVersionViewModel>();
                    cfg.CreateMap<ProductVersionViewModel, ProductVersion>();
                    cfg.CreateMap<Product, ProductViewModel>();
                    cfg.CreateMap<ProductViewModel, Product>();
                });

                Func<BomStructure, BomStructure> getNewNode = bs => new BomStructure()
                {
                    Parent = bs,
                    ParentId = bs.BomStructureId,
                    RootVersionId = bs.RootVersionId,
                    RootId = bs.RootId
                };
                Action<BomStructure, BomStructure> getConfig = (bs1, bs2) =>
                {
                    bs2.BomStructureId = bs1.BomStructureId;
                    bs2.RootVersionId = bs1.RootVersionId;
                    bs2.RootId = bs1.RootId;
                };
                Func<BomStructure, BomStructure, bool> getKey = (bNode1, bNode2) => bNode1.BomStructureId == bNode2.BomStructureId;
                Func<BomStructure, List<BomStructure>> getChilds = bNode => bNode.Childs;
                Func<BomStructure, int> getCompareKey = bNode => bNode.BomStructureId;

                var nowBomNode = Mapper.Map<BomNodeViewModel, BomStructure>(bNodeViewModel);

                if (nowBomNode.BomStructureId <= 0)
                {
                    var existBomNode = new BomStructure() { Parent = null, ParentId = null, RootVersionId = nowBomNode.NodeVersionId };
                    UnitOfWork.InsertEntity(existBomNode);
                    existBomNode.RootId = existBomNode.BomStructureId;
                    UnitOfWork.AddNodeValues(existBomNode, nowBomNode, getChilds, getNewNode, getConfig);
                    nowBomNode = existBomNode;
                }
                else
                {
                    var existBomNodeList = UnitOfWork.EntitySet<BomStructure>()
                    .Where(bomNd => bomNd.RootId == bNodeViewModel.BomStructureId)
                    .ToList();
                    var existBomNode = existBomNodeList.FirstOrDefault(bomNd => bomNd.BomStructureId == bNodeViewModel.BomStructureId && bomNd.ParentId == null);
                    nowBomNode.Parent = null;
                    nowBomNode.ParentId = null;
                    UnitOfWork.UpdateNodeValues(existBomNode, nowBomNode, getChilds, getCompareKey, getKey, getNewNode, getConfig);
                    nowBomNode = existBomNode;
                }
                CalaOrder(nowBomNode); //计算序号，层次，结点左序号，结点右序号,数量
                                       // CalaNeedTotal(nowBomNode); //计算数量
                UnitOfWork.AcceptAllChanges();
                if (nowBomNode.RootId < 0)
                {
                    // var retCount = UnitOfWork.ExecuteSqlCommand("update Reports set RootId = {1} where RootId ={0}", nowReport.RootId, nowReport.ReportId);
                    UnitOfWork.UpdateLocalNodeValues(nowBomNode, (nd) => nd.Childs, (nd) => nd.RootId = nowBomNode.BomStructureId);
                    UnitOfWork.AcceptAllChanges();
                }
                return okResponse(Mapper.Map<BomStructure, BomNodeViewModel>(nowBomNode));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                // return BadResponse(reqMsg.Playload.FirstOrDefault());
            }
            return BadResponse(new BomNodeViewModel());
        }

        public ResponseMessage<BomNodeViewModel> DeleteBomNode(RequestMessage<BomNodeViewModel> reqMsg)
        {
            var bomNodeViewModel = reqMsg.Playload.FirstOrDefault();
            var existNodeLists = UnitOfWork?.EntitySet<BomStructure>()
            .FromSql("CALL getBomNodes({0},{1})", bomNodeViewModel.BomStructureId, bomNodeViewModel.RootId)
            .ToList();
            var existNode = existNodeLists.Where(r => r.BomStructureId == bomNodeViewModel.BomStructureId).FirstOrDefault();
            UnitOfWork.DeleteNode(existNode, (nd) => nd.Childs);
            UnitOfWork.AcceptAllChanges();
            if (bomNodeViewModel.BomStructureId != bomNodeViewModel.RootId)
            {
                //找出根结点和根版次 
                updateNodeOrder(bomNodeViewModel.RootId, bomNodeViewModel.RootId);
                UnitOfWork.AcceptAllChanges();
            }
            return okResponse(bomNodeViewModel);
        }

        public ResponseMessage<BomNodeViewModel> GetBomNode(RequestMessage<BomNodeViewModel> reqMsg)
        {
            throw new NotImplementedException();
        }

        public ResponseMessage<BomNodeViewModel> CalaNeedTotal(RequestMessage<BomNodeViewModel> reqMsg)
        {
            throw new NotImplementedException();
        }

        public ResponseMessage<BomNodeViewModel> CalaCost(RequestMessage<BomNodeViewModel> reqMsg)
        {
            throw new NotImplementedException();

        }
        private void CalaNeedTotal(BomStructure rootNode)
        {
            // rootNode.Total = (rootNode.Parent == null ? 1 : rootNode.SingleTotal * rootNode.Parent.Total);
            foreach (var child in rootNode.Childs)
            {
                child.Total = child.SingleTotal * rootNode.Total;
                CalaNeedTotal(child);
            }
        }

        private double CalaCost(BomStructure rootNode)
        {
            var curCost = 1 * rootNode.Total;
            int i = 0;
            foreach (var child in rootNode.Childs)
            {
                rootNode.Cost = CalaCost(child) + (i == 0 ? 0 : rootNode.Cost);
                i += 1;
            }
            rootNode.Cost = curCost + (i == 0 ? 0 : rootNode.Cost);
            return rootNode.Cost;
        }
        private List<BomStructure> CalaBomNodeData(decimal initTotal, BomStructure rootNode)
        {
            List<BomStructure> bomNodes = new List<BomStructure>();
            bomNodes.Add(rootNode);
            foreach (var child in rootNode.Childs)
            {
                bomNodes.AddRange(CalaBomNodeData(1000, child));
            }

            CalaCost(rootNode);
            decimal initNeedTotal = 0M;
            for (int i = 0; i < bomNodes.Count; i++)
            {
                var curNode = bomNodes[i];
                // curNode.Ord = i + 1;
                curNode.UsedKc = new Random().Next(500, 5000);
                decimal xMrpTotal = Math.Round(0.00M, 2);
                decimal xMaoTotal = Math.Round(0.00M, 2);
                if (curNode.Parent != null)
                {
                    // curNode.Level = curNode.Parent.Level + 1;
                    curNode.Total = curNode.Parent.Total * curNode.SingleTotal; //单位数量
                    curNode.NeedTotal = curNode.Parent.NeedTotal * (decimal)curNode.Total;
                    xMaoTotal = curNode.Parent.MrpTotal * (decimal)curNode.Total;
                    xMrpTotal = xMaoTotal - curNode.UsedKc;
                    if (xMrpTotal < 0) xMrpTotal = 0;
                }
                else
                {
                    // curNode.Level = 1;
                    curNode.Total = 1 * curNode.SingleTotal;
                    curNode.NeedTotal = initNeedTotal * (decimal)curNode.Total;
                    xMaoTotal = (decimal)curNode.Total * initNeedTotal;
                    xMrpTotal = xMaoTotal - curNode.UsedKc;
                    if (xMrpTotal < 0) xMrpTotal = 0;
                }
                curNode.MaoTotal = xMaoTotal;
                curNode.MrpTotal = xMrpTotal;
            }
            return bomNodes;
        }

        private void CalaBomNodeData2(BomStructure rootNode, decimal initTotal)
        {
            decimal xMaoTotal = 0M;
            decimal xMrpTotal = 0M;
            foreach (var childNode in rootNode.Childs)
            {
                childNode.UsedKc = 0; //计算可用库存量
                                      // childNode.Total = rootNode.Total * childNode.SingleTotal; //单位数量
                childNode.NeedTotal = rootNode.NeedTotal * (decimal)childNode.Total;
                xMaoTotal = rootNode.MrpTotal * (decimal)childNode.Total;
                xMrpTotal = xMaoTotal - childNode.UsedKc;
                if (xMrpTotal < 0) xMrpTotal = 0;
            }
        }
        private void InitRootNodeData(BomStructure rootNode, decimal initTotal)
        {
            rootNode.UsedKc = 0;
            //  rootNode.Total = 1 * rootNode.SingleTotal;
            rootNode.NeedTotal = initTotal * (decimal)rootNode.Total;
            decimal xMaoTotal = (decimal)rootNode.Total * initTotal;
            decimal xMrpTotal = xMaoTotal - rootNode.UsedKc;
            if (xMrpTotal < 0) xMrpTotal = 0;
            rootNode.MaoTotal = xMaoTotal;
            rootNode.MrpTotal = xMrpTotal;
        }

        /// <summary>
        /// 根据产品版次查找所有引用的结点
        /// </summary>
        /// <param name="productVserionId"></param>
        private List<BomStructure> GetAllRefNodeByVersion(int productVserionId)
        {
            return UnitOfWork.Query<BomStructure>()
            .FromSql("CALL getNodesByVersion({0})", productVserionId)
            .ToList();
        }

        private List<BomStructure> GetBomNodesByVersion(int productVserionId, int rootId)
        {
            return UnitOfWork.Query<BomStructure>()
            .FromSql("select * from BomStructures where RootProductVersionId = {0} and RootId = {1}", productVserionId, rootId)
            .ToList();
        }

        private void UpdateAllRefNodeByVersion(int nowRootId, int nowVersionId, int oldVersionId)
        {
            var nowNodes = GetBomNodesByVersion(nowVersionId, nowRootId);
            var allRefNodes = GetAllRefNodeByVersion(oldVersionId);
            var nowRootNode = nowNodes.Find(nd => nd.ParentId == null && nd.NodeVersionId == nd.RootVersionId);

            Func<BomStructure, BomStructure> getNewNode = bNode => new BomStructure()
            {
                Parent = bNode,
                ParentId = bNode.BomStructureId,
                RootVersionId = bNode.RootVersionId,
                RootId = bNode.RootId
            };
            Action<BomStructure, BomStructure> getConfig = (bNode1, bNode2) =>
            {
                bNode2.BomStructureId = bNode1.BomStructureId;
                bNode2.RootVersionId = bNode1.RootVersionId;
                bNode2.RootId = bNode1.RootId;
            };
            Func<BomStructure, BomStructure, bool> getKey = (bNode1, bNode2) => bNode1.BomStructureId == bNode2.BomStructureId;
            Func<BomStructure, List<BomStructure>> getChilds = bNode => bNode.Childs;
            Func<BomStructure, int> getCompareKey = bNode => bNode.BomStructureId;
            foreach (var nd in allRefNodes.Where(nd => nd.NodeVersionId == oldVersionId))
            {
                UnitOfWork.UpdateNodeValues(nd, nowRootNode, getChilds, getCompareKey, getKey, getNewNode, getConfig);
                // updateNodeOrder(nd.RootId, nd.RootId);
                var allNodes = UnitOfWork.EntitySet<BomStructure>()
                 .FromSql("CALL getBomNodes({0},{1})", nd.RootId, nd.RootId)
                 .ToList();
                var rootNode = allNodes.Find(bnd => bnd.BomStructureId == nd.RootId);
                if (rootNode != null)
                {
                    CalaOrder(rootNode);
                }
            }
            UnitOfWork.AcceptAllChanges();
        }


    }
}