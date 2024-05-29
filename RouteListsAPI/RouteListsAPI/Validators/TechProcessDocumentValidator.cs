using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class TechProcessDocumentValidator : AbstractValidator<TechProcessDocument>
    {
        public TechProcessDocumentValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithName("Наименование");
        }
    }
}