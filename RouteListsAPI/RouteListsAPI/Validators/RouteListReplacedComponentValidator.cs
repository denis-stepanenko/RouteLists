using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListReplacedComponentValidator : AbstractValidator<RouteListReplacedComponent>
    {
        public RouteListReplacedComponentValidator()
        {
            RuleFor(x => x.Date).NotDefault().IsCorrect().WithName("Дата");
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
        }
    }
}