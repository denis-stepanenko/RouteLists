using FluentValidation;
using RouteListsAPI.DTOs;

namespace RouteListsAPI.Validators
{
    public class ChangePasswordValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordValidator()
        {
            RuleFor(x => x.NewPassword).MinimumLength(6).WithName("Пароль");
        }
    }
}