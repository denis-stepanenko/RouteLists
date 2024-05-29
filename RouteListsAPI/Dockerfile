FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine

WORKDIR /app

COPY . .

RUN dotnet restore

RUN dotnet publish -c Release -o out

WORKDIR /app/out

ENV ASPNETCORE_URLS http://*:5000

EXPOSE 5000

CMD ["dotnet", "RouteListsAPI.dll"]