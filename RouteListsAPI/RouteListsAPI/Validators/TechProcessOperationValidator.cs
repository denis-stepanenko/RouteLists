using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class TechProcessOperationValidator : AbstractValidator<TechProcessOperation>
    {
        public TechProcessOperationValidator()
        {
            RuleFor(x => x.Count).GreaterThanOrEqualTo(0).WithName("Количество");
        }
    }
}