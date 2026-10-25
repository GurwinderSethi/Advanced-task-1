FROM microsoft/dotnet:2.0.0-runtime
WORKDIR /dotnetapp
COPY ./.bin/Docker .
ARG ASPNETCORE_URLS
ENV ASPNETCORE_URLS=$ASPNETCORE_URLS
ENV ASPNETCORE_ENVIRONMENT docker
ENTRYPOINT dotnet Mars.Services.Profile.dll
