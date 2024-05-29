using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListFramelessComponentValidator : AbstractValidator<RouteListFramelessComponent>
    {
        public RouteListFramelessComponentValidator()
        {
            RuleFor(x => x.DateOfIssueForProduction).NotDefault().IsCorrect().WithName("Дата выдачи в производство");
            RuleFor(x => x.DateOfSealing).NotDefault().IsCorrect().WithName("Дата герметизации");
            RuleFor(x => x.DaysBeforeSealing).GreaterThanOrEqualTo(0).WithName("Количество");
        }
    }
}