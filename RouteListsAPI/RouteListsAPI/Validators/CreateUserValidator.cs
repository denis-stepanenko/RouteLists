using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithName("Имя пользователя");
            RuleFor(x => x.Password).MinimumLength(6).WithName("Пароль");
            RuleFor(x => x.Name).NotEmpty().WithName("Наименование");
            RuleFor(x => x.Department).GreaterThan(0).WithName("Подразделение");
        }
    }
}