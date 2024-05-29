using FluentValidation;
using RouteListsAPI.Models;

namespace RouteListsAPI.Validators
{
    public class RouteListDocumentValidator : AbstractValidator<RouteListDocument>
    {
        public RouteListDocumentValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithName("Наименоване");
        }
    }
}