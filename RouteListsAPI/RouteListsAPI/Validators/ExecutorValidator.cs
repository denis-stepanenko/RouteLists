using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class ExecutorValidator : AbstractValidator<Executor>
    {
        public ExecutorValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithName("Имя");
            RuleFor(x => x.SecondName).NotEmpty().WithName("Фамилия");
            RuleFor(x => x.Patronymic).NotEmpty().WithName("Отчество");
            RuleFor(x => x.Department).GreaterThan(0).WithName("Подразделение");
        }
    }
}