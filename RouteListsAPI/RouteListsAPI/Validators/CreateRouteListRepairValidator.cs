using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListRepairValidator : AbstractValidator<CreateRouteListRepairDto>
    {
        public CreateRouteListRepairValidator()
        {
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
            RuleFor(x => x.Ids).NotEmpty().WithMessage("Выберите операции");
        }
    }
}