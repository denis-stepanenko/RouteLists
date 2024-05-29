using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateRouteListReplacedComponentValidator : AbstractValidator<CreateRouteListReplacedComponentDto>
    {
        public CreateRouteListReplacedComponentValidator()
        {
            RuleFor(x => x.Date).NotDefault().IsCorrect().WithName("Дата");
            RuleFor(x => x.Products).NotEmpty().WithMessage("Выберите продукты");
            RuleFor(x => x.ExecutorId).NotEqual(0).WithMessage("Выберите исполнителя");
        }
        
    }
}