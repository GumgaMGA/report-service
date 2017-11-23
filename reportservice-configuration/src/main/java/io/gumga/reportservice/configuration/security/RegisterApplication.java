package io.gumga.reportservice.configuration.security;

import io.gumga.reportservice.configuration.application.ApplicationConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by willian on 16/11/17.
 */
@Component
public class RegisterApplication {

    @Autowired
    private SecurityIntegration securityIntegration;

    @Autowired
    private ApplicationConstants applicationConstants;

    private static final Logger LOGGER = LoggerFactory.getLogger(RegisterApplication.class);

    private Map software;
    private Map organization;
    private Map token = new HashMap();
    private Map instance;
    HttpHeaders headers;

    public RegisterApplication() {

    }

    public void register() {
        try {
            headers = new HttpHeaders();
            headers = securityIntegration.eternalToken();
            token = securityIntegration.token(headers.get("gumgaToken").get(0));
            organization = securityIntegration.organizationFatByOi((String) token.get("organizationHierarchyCode"));
            software = createSoftware();
            instance = createinstanceBySoftware();
            createRole();
            securityIntegration.newObjectOperationGroup(headers, "Operations to " + ((Map) software.get("url")).get("value"));
        } catch (Exception e) {
            LOGGER.warn("Some errors were detected on register in security.");
        }
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
        } else {
            securityIntegration.checkOperationsSoftware(headers, (String) map.get("name"), SecurityIntegration.getOperations().stream()
            .map(op -> {
                HashMap<String, Object> ob = new HashMap<>();
                ob.put("name", op.name);
                ob.put("description", op.description);
                ob.put("thousandValue", op.thousandValue);
                ob.put("basicOperation", op.basicOperation);
                ob.put("billed", op.billed);
                ob.put("key", op.key);
                return ob;
            }).collect(Collectors.toList()));
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
