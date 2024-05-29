using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListModificationValidator : AbstractValidator<RouteListModification>
    {
        public RouteListModificationValidator()
        {
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
        }
    }
}