using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateTechProcessValidator : AbstractValidator<CreateTechProcessDto>
    {
        public CreateTechProcessValidator()
        {
            RuleFor(x => x.ProductId).NotEqual(0).WithMessage("Выберите продукт");
        }
    }
}