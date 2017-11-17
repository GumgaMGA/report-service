package io.gumga.reportservice.configuration.security;

import io.gumga.reportservice.configuration.application.ApplicationConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by willian on 16/11/17.
 */
@Component
public class RegisterApplication {

    @Autowired
    private SecurityIntegration securityIntegration;

    @Autowired
    private ApplicationConstants applicationConstants;

    private Map software;
    private Map organization;
    private Map token = new HashMap();
    private Map instance;
    HttpHeaders headers;

    public RegisterApplication() {

    }

    public void register() {
        headers = new HttpHeaders();
        headers = securityIntegration.eternalToken();
        token = securityIntegration.token(headers.get("gumgaToken").get(0));
        organization = securityIntegration.organizationFatByOi((String) token.get("organizationHierarchyCode"));
        software = createSoftware();
        instance = createinstanceBySoftware();
        createRole();
        securityIntegration.newObjectOperationGroup(headers, "Operations to " + ((Map) software.get("url")).get("value"));
    }

    public Map createSoftware() {
        Map map = securityIntegration.softwareByName(headers, applicationConstants.getSoftwareName());
        if (map == null) {
            Map<String, Object> software = new HashMap();
            software.put("gumgaOrganizations", ",");
            software.put("gumgaUsers", ",");
            software.put("modules", new ArrayList<>());
            software.put("name", applicationConstants.getSoftwareName());
            software.put("operations", SecurityIntegration.getOperations());
            software.put("root", true);

            HashMap<Object, Object> value = new HashMap<>();
            value.put("value", applicationConstants.getSoftwareName());

            software.put("url", value);
            software.put("softwareValues", new ArrayList<>());
            map = securityIntegration.createSoftware(headers, software);
        }
        return map;
    }

    public Map createinstanceBySoftware() {
        List instances = securityIntegration.instancesOfOrganizationWithSoftware(headers, (String) token.get("organizationHierarchyCode"), software);
        if (instances != null && instances.size() > 0) {
            instance = (Map) instances.get(0);
        }
        if (instance == null) {
            Map<String, Object> map = new HashMap();
            map.put("active", true);
            map.put("customInfo", null);
            map.put("defaultTokenDuration", null);
            map.put("name", "Instance to " + ((Map) software.get("url")).get("value"));
            Calendar c = Calendar.getInstance();
            c.add(Calendar.MONTH, 12);
            map.put("expiration", c.getTime());
            map.put("instanceValues", new ArrayList<>());
            map.put("organization", organization);
            map.put("softwares", Collections.singletonList(software));
            instance = securityIntegration.createInstance(headers, map);
        }
        return instance;
    }

    public Map createRole() {
        Map login = securityIntegration.userByEmail((String) token.get("login"));
        return securityIntegration.createNewRoleByInstanceWithOperationsAddingUser(login, headers, instance, (List) software.get("operations"), "Role to " + ((Map) software.get("url")).get("value"));
    }
}
