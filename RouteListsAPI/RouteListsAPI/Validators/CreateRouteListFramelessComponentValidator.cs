using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListFramelessComponentValidator : AbstractValidator<CreateRouteListFramelessComponentDto>
    {
        public CreateRouteListFramelessComponentValidator()
        {
            RuleFor(x => x.DateOfIssueForProduction).NotDefault().IsCorrect().WithName("Дата выдачи в производство");
            RuleFor(x => x.DateOfSealing).NotDefault().IsCorrect().WithName("Дата герметизации");
            RuleFor(x => x.DaysBeforeSealing).GreaterThanOrEqualTo(0).WithName("Количество");
            RuleFor(x => x.Ids).NotEmpty().WithMessage("Выберите продукты");
        }
    }
}