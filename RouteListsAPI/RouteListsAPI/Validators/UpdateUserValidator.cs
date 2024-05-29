using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithName("Имя пользователя");
            RuleFor(x => x.Name).NotEmpty().WithName("Наименование");
            RuleFor(x => x.Department).GreaterThan(0).WithName("Подразделение");
        }
    }
}