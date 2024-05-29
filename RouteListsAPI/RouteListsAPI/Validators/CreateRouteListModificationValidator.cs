using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListModificationValidator : AbstractValidator<CreateRouteListModificationDto>
    {
        public CreateRouteListModificationValidator()
        {
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
            RuleFor(x => x.Ids).NotEmpty().WithMessage("Выберите операции");
        }
    }
}