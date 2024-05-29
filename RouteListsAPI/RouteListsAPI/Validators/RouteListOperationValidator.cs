using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListOperationValidator : AbstractValidator<RouteListOperation>
    {
        public RouteListOperationValidator()
        {
            RuleFor(x => x.Count).GreaterThanOrEqualTo(0).WithName("Количество");
        }
    }
}