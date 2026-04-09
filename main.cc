#include <drogon/drogon.h>

int main()
{
    drogon::app().loadConfigFile(CCDROGON_CONFIG_PATH);
    drogon::app().run();
    return 0;
}