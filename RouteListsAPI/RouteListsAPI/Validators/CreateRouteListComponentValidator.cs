using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListComponentValidator : AbstractValidator<CreateRouteListComponentDto>
    {
        public CreateRouteListComponentValidator()
        {
            RuleFor(x => x.Count).NotNull().GreaterThan(0).WithName("Количество");
            RuleFor(x => x.Products).NotEmpty().WithMessage("Выберите продукты");
        }
    }
}