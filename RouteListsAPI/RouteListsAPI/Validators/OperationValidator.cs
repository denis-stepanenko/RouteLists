using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class OperationValidator : AbstractValidator<Operation>
    {
        public OperationValidator()
        {
            RuleFor(x => x.Code).NotEmpty().WithName("Код");
            RuleFor(x => x.Name).NotEmpty().WithName("Наименование");
            RuleFor(x => x.Department).GreaterThan(0).WithName("Цех");
        }
    }
}