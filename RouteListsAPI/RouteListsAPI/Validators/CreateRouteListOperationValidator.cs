using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListOperationValidator : AbstractValidator<CreateRouteListOperationDto>
    {
        public CreateRouteListOperationValidator()
        {
            RuleFor(x => x.Count).GreaterThanOrEqualTo(0).WithName("Количество");
            RuleFor(x => x.Ids).NotEmpty().WithMessage("Выберите операции");
        }
    }
}