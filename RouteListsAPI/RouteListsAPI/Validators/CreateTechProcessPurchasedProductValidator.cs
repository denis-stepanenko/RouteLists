using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateTechProcessPurchasedProductValidator : AbstractValidator<CreateTechProcessPurchasedProductDto>
    {
        public CreateTechProcessPurchasedProductValidator()
        {
            RuleFor(x => x.Products).NotEmpty().WithMessage("Выберите продукты");
        }
    }
}