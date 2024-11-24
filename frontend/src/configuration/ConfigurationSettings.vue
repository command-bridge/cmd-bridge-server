<template>
  <v-app>
    <v-container>
      <v-stepper :items="items" v-model="currentStep">
        <!-- Step 1: Database Configuration -->
        <template v-slot:item.1>
          <v-card flat>
            <h3>Database Configuration</h3>
            <v-select
              v-model="config.DB_TYPE"
              :items="dbEngines"
              item-title="text"
              item-value="value"              
              label="Database Engine"
              outlined
              required
            />
            <v-text-field
              v-model="config.DB_URL"
              label="Database URL"
              outlined
              required
            />
            <v-text-field
              v-model="config.DB_USERNAME"
              label="Database User"
              outlined
              required
            />
            <v-text-field
              v-model="config.DB_PASSWORD"
              label="Database Password"
              type="password"
              outlined
              required
            />
          </v-card>
        </template>

        <!-- Step 2: Environment -->
        <template v-slot:item.2>
          <v-card flat>
            <h3>Environment</h3>
            <v-text-field
              v-model="config.ENVIRONMENT_PREFIX"
              label="Environment Databases Prefix"
              outlined
              required
            />
            <v-text-field
              v-model="config.ENVIRONMENT_NAME"
              label="Environment Name"
              outlined
              required
            />
            <v-switch
              v-model="config.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS"
              label="Use Default Database Credentials"
              outlined
            />
            <div v-if="!config.ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS">
              <v-select
                v-model="config.ENVIRONMENT_DB_TYPE"
                :items="dbEngines"
                item-title="text"
                item-value="value"                  
                label="Environment Database Engine"
                outlined
              />
              <v-text-field
                v-model="config.ENVIRONMENT_DB_URL"
                label="Environment Host"
                outlined
              />
              <v-text-field
                v-model="config.ENVIRONMENT_DB_USERNAME"
                label="Environment User"
                outlined
              />
              <v-text-field
                v-model="config.ENVIRONMENT_DB_PASSWORD"
                label="Environment Password"
                type="password"
                outlined
              />
            </div>
          </v-card>
        </template>

        <!-- Step 3: Admin User Setup -->
        <template v-slot:item.3>
          <v-card flat>
            <h3>Admin User Setup</h3>
            <v-text-field
              v-model="config.ADMIN_NAME"
              label="Admin Name"
              outlined
              required
            />

            <v-text-field
              v-model="config.ADMIN_USERNAME"
              label="Admin Username"
              outlined
              required
            />
            <v-text-field
              v-model="config.ADMIN_PASSWORD"
              label="Admin Password"
              type="password"
              outlined
              required
            />
          </v-card>
        </template>

        <!-- Step 4: Miscellaneous Configuration -->
        <template v-slot:item.4>
          <v-card flat>
            <h3>Server Configuration</h3>
            <v-text-field
              v-model="config.APPLICATION_NAME"
              label="Application name"
              outlined
              required
            />

            <v-text-field
              v-model="config.SERVER_BACKEND_URL"
              label="Backend address"
              outlined
              required
            />
            <v-select
              v-model="config.SERVER_MEMORY_ENGINE"
              :items="memoryEngines"
              item-title="text"
              item-value="value"                
              label="Server memory engine (for caching, temporary, etc)"
              outlined
            />            
          </v-card>
        </template>

        <!-- Step 5: Save Configuration -->
        <template v-slot:item.5>
          <v-card flat>
            <h3>Review and Save Configuration</h3>
            <p>Review your settings before saving:</p>
            <v-list dense>
              <v-list-item v-for="(value, key) in config" :key="key">
                <v-list-item-content>
                  <strong>{{ key }}:</strong> {{ value }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn color="primary" @click="saveConfig">Save and Finish</v-btn>
          </v-card>
        </template>
      </v-stepper>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      items: [
        'Database Configuration',
        'Environment',
        'Admin User Setup',
        'Server Configuration',
        'Review & Save',
      ],
      dbEngines: [
        { text: 'MySQL', value: 'mysql' },
        { text: 'Postgres', value: 'postgres' },
        { text: 'MSSQL Server', value: 'mssql' },
        { text: 'MariaDB', value: 'mariadb' }
      ],
      memoryEngines: [ 
        { text: 'Database', value: 'database' },
        /*
        { text: 'In Memory', value: 'in_memory' },
        { text: 'Redis', value: 'redis' },
        { text: 'MongoDB', value: 'mongodb' }
         */
      ],
      config: {
        // Environment Section
        ENVIRONMENT_PREFIX: 'db-env-$id',
        ENVIRONMENT_NAME: '',
        ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS: true,
        ENVIRONMENT_DB_TYPE: '',
        ENVIRONMENT_DB_URL: '',
        ENVIRONMENT_DB_USERNAME: '',
        ENVIRONMENT_DB_PASSWORD: '',
        // Database Section
        DB_TYPE: '',
        DB_URL: '',
        DB_USERNAME: '',
        DB_PASSWORD: '',
        // Admin User Section
        ADMIN_NAME: '',
        ADMIN_USERNAME: '',
        ADMIN_PASSWORD: '',
        // Server configuration
        APPLICATION_NAME: 'CommandBridge',
        SERVER_BACKEND_URL: '',
        SERVER_MEMORY_ENGINE: '',
      },
    };
  },
  methods: {
    saveConfig() {
      const configApiUrl = 'http://localhost:3000/config/save'; // Update the URL to match your backend

      fetch(configApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.config),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to save configuration');
          }
          return response.text();
        })
        .then((message) => {
          alert(message); // Show success message
          this.resetStepper();
        })
        .catch((error) => {
          console.error(error);
          alert('Error saving configuration: ' + error.message);
        });
    },
    resetStepper() {
      // Reset the stepper to the first step
      this.currentStep = 1;
      this.config = {
        // Environment Section
        ENVIRONMENT_PREFIX: 'db-env-$id',
        ENVIRONMENT_NAME: '',
        ENVIRONMENT_USE_DEFAULT_DB_CREDENTIALS: true,
        ENVIRONMENT_DB_TYPE: '',
        ENVIRONMENT_DB_URL: '',
        ENVIRONMENT_DB_USERNAME: '',
        ENVIRONMENT_DB_PASSWORD: '',
        // Database Section
        DB_TYPE: '',
        DB_URL: '',
        DB_USERNAME: '',
        DB_PASSWORD: '',
        // Admin User Section
        ADMIN_NAME: '',
        ADMIN_USERNAME: '',
        ADMIN_PASSWORD: '',
        // Server configuration
        APPLICATION_NAME: 'CommandBridge',
        SERVER_BACKEND_URL: 'http://localhost:3000',
        SERVER_MEMORY_ENGINE: '',
      };
    },
  },
};
</script>

<style>
/* Optional styling */
</style>
