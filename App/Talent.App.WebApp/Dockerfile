FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /talentWebPortal
COPY ./.bin/Docker .
ARG ASPNETCORE_URLS
ENV ASPNETCORE_URLS=$ASPNETCORE_URLS
ENV ASPNETCORE_ENVIRONMENT docker
ENTRYPOINT dotnet Talent.App.WebApp.dll


