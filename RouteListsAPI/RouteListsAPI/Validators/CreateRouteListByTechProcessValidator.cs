using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListByTechProcessValidator : AbstractValidator<CreateRouteListByTechProcessDto>
    {
        public CreateRouteListByTechProcessValidator()
        {
            RuleFor(x => x.TechProcessId).NotEqual(0).WithMessage("Выберите шаблон");
            RuleFor(x => x.ProductCount).GreaterThan(0).WithName("Количество");
            RuleFor(x => x.Date).NotDefault().IsCorrect().WithName("Дата");
        }
    }
}