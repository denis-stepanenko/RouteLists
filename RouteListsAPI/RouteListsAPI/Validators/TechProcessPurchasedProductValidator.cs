using FluentValidation;
using RouteListsAPI.DTOs;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class TechProcessPurchasedProductValidator : AbstractValidator<TechProcessPurchasedProduct>
    {
        public TechProcessPurchasedProductValidator()
        {
            RuleFor(x => x.Count).GreaterThanOrEqualTo(0).GreaterThan(0).WithName("Количество");
        }
    }
}