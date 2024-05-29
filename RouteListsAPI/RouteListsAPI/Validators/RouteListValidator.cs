using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListValidator : AbstractValidator<RouteList>
    {
        public RouteListValidator()
        {
            RuleFor(x => x.Number).NotEmpty().WithName("Номер");
            RuleFor(x => x.Date).NotDefault().IsCorrect().WithName("Дата");
            RuleFor(x => x.ProductCode).NotEmpty().WithMessage("Выберите продукт");
            RuleFor(x=> x.ProductCount).GreaterThan(0).WithName("Количество");
            RuleFor(x => x.Department).GreaterThan(0).WithName("Цех");
        }
    }
}