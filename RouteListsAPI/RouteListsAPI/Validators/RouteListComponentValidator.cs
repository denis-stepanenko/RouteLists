using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListComponentValidator : AbstractValidator<RouteListComponent>
    {
        public RouteListComponentValidator()
        {
            RuleFor(x => x.Count).GreaterThan(0).WithName("Количество");
        }
    }
}