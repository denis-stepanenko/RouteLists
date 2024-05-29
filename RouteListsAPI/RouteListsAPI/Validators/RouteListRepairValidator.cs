using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListRepairValidator : AbstractValidator<RouteListRepair>
    {
        public RouteListRepairValidator()
        {
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
        }
    }
}