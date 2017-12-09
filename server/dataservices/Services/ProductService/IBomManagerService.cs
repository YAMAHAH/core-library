using DataService.Models;
using DataService.ServicesBase;

namespace dataservices.Services.ProductService
{
    public interface IBomManagerService : IServiceBase
    {
        ResponseMessage<BomNodeViewModel> UpsertRootBomNode(RequestMessage<BomNodeViewModel> reqMsg);
        ResponseMessage<BomNodeViewModel> UpsertBomNode(RequestMessage<BomNodeViewModel> reqMsg);
        ResponseMessage<BomNodeViewModel> DeleteBomNode(RequestMessage<BomNodeViewModel> reqMsg);
        ResponseMessage<BomNodeViewModel> GetBomNode(RequestMessage<BomNodeViewModel> reqMsg);
        ResponseMessage<BomNodeViewModel> CalaNeedTotal(RequestMessage<BomNodeViewModel> reqMsg);
        ResponseMessage<BomNodeViewModel> CalaCost(RequestMessage<BomNodeViewModel> reqMsg);

    }
}