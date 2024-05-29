using FluentValidation;

namespace RouteListsAPI.Validators
{
    public static class MyCustomValidators
    {
        private static readonly DateTime minDate = new DateTime(1753, 1, 1);

        public static IRuleBuilderOptions<T, DateTime?> NotDefault<T>(this IRuleBuilder<T, DateTime?> ruleBuilder)
        {
            return ruleBuilder.NotEqual(default(DateTime)).WithMessage("'{PropertyName}' не указано значение");
        }

        public static IRuleBuilderOptions<T, DateTime> NotDefault<T>(this IRuleBuilder<T, DateTime> ruleBuilder)
        {
            return ruleBuilder.NotEqual(default(DateTime)).WithMessage("'{PropertyName}' не указано значение");
        }

        public static IRuleBuilderOptions<T, DateTime?> IsCorrect<T>(this IRuleBuilder<T, DateTime?> ruleBuilder)
        {
            return ruleBuilder.Must(x => x == default(DateTime) || x == null || x > minDate)
                .WithMessage("'{PropertyName}' должно быть больше чем " + minDate.ToString("yyyy-MM-dd"));
        }

        public static IRuleBuilderOptions<T, DateTime> IsCorrect<T>(this IRuleBuilder<T, DateTime> ruleBuilder)
        {
            return ruleBuilder.Must(x => x == default || x > minDate)
                .WithMessage("'{PropertyName}' должно быть больше чем " + minDate.ToString("yyyy-MM-dd"));
        }
    }
}