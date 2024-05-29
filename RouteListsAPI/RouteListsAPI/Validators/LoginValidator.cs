using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class LoginValidator : AbstractValidator<LoginDto>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithName("Имя пользователя");
            RuleFor(x => x.Password).NotEmpty().WithName("Пароль");
        }
    }
}