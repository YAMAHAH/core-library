using DataService.Models;
using DataService.ServicesBase;

namespace dataservices.Services.ReportService
{
    public interface IReportService : IServiceBase
    {
        ResponseMessage<ReportViewModel> CreateOrUpdateRootReport(RequestMessage<ReportViewModel> reqMsg);
        ResponseMessage<ReportViewModel> CreateOrUpdateReport(RequestMessage<ReportViewModel> reqMsg);
        ResponseMessage<ReportViewModel> DeleteReport(RequestMessage<ReportViewModel> reqMsg);
        ResponseMessage<ReportViewModel> GetReport(RequestMessage<ReportViewModel> reqMsg);
    }
}