using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateTechProcessOperationValidator : AbstractValidator<CreateTechProcessOperationDto>
    {
        public CreateTechProcessOperationValidator()
        {
            RuleFor(x => x.Count).GreaterThanOrEqualTo(0).WithName("Количество");
            RuleFor(x => x.Ids).NotEmpty().WithMessage("Выберите операции");
        }
    }
}