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
              :error-messages="errors.DB_TYPE"
            />
            <v-text-field
              v-model="config.DB_URL"
              label="Database URL"
              outlined
              required
              :error-messages="errors.DB_URL"
            />
            <v-text-field
              v-model="config.DB_USERNAME"
              label="Database User"
              outlined
              required
              :error-messages="errors.DB_USERNAME"
            />
            <v-text-field
              v-model="config.DB_PASSWORD"
              label="Database Password"
              type="password"
              outlined
              required
              :error-messages="errors.DB_PASSWORD"
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
              :error-messages="errors.ENVIRONMENT_PREFIX"
            />
            <v-text-field
              v-model="config.ENVIRONMENT_NAME"
              label="Environment Name"
              outlined
              required
              :error-messages="errors.ENVIRONMENT_NAME"
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
                :error-messages="errors.ENVIRONMENT_DB_URL"
              />
              <v-text-field
                v-model="config.ENVIRONMENT_DB_USERNAME"
                label="Environment User"
                outlined
                :error-messages="errors.ENVIRONMENT_DB_USERNAME"
              />
              <v-text-field
                v-model="config.ENVIRONMENT_DB_PASSWORD"
                label="Environment Password"
                type="password"
                outlined
                :error-messages="errors.ENVIRONMENT_DB_PASSWORD"
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
              :error-messages="errors.ADMIN_NAME"
            />

            <v-text-field
              v-model="config.ADMIN_USERNAME"
              label="Admin Username"
              outlined
              required
              :error-messages="errors.ADMIN_USERNAME"
            />
            <v-text-field
              v-model="config.ADMIN_PASSWORD"
              label="Admin Password"
              type="password"
              outlined
              required
              :error-messages="errors.ADMIN_PASSWORD"
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
              :error-messages="errors.APPLICATION_NAME"
            />

            <v-text-field
              v-model="config.SERVER_BACKEND_URL"
              label="Backend address"
              outlined
              required
              :error-messages="errors.SERVER_BACKEND_URL"
            />
            <v-select
              v-model="config.SERVER_MEMORY_ENGINE"
              :items="memoryEngines"
              item-title="text"
              item-value="value"                
              label="Server memory engine (for caching, temporary, etc)"
              :error-messages="errors.SERVER_MEMORY_ENGINE"
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
      errors: {}, // Store validation errors here
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
        SERVER_BACKEND_URL: 'http://localhost:3000',
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
            return response.json().then((error) => {
              throw new Error(JSON.stringify(error));
            });
          }
          return response.text();
        })
        .then((message) => {
          alert(message); // Show success message
          this.resetStepper();
        })
        .catch((error) => {
          const errorData = JSON.parse(error.message);
          if (errorData?.message) {
            this.processValidationErrors(errorData.message);
          } else {
            alert('Error saving configuration: ' + error.message);
          }
        });
    },
    processValidationErrors(messages) {
      // Reset previous errors
      this.errors = {};
      let firstErrorStep = null;

      const fieldToStepMap = {
        DB_TYPE: 1,
        DB_URL: 1,
        DB_USERNAME: 1,
        DB_PASSWORD: 1,
        ENVIRONMENT_PREFIX: 2,
        ENVIRONMENT_NAME: 2,
        ENVIRONMENT_DB_TYPE: 2,
        ENVIRONMENT_DB_URL: 2,
        ENVIRONMENT_DB_USERNAME: 2,
        ENVIRONMENT_DB_PASSWORD: 2,
        ADMIN_NAME: 3,
        ADMIN_USERNAME: 3,
        ADMIN_PASSWORD: 3,
        APPLICATION_NAME: 4,
        SERVER_BACKEND_URL: 4,
        SERVER_MEMORY_ENGINE: 4,
      };

      // Parse validation errors
      messages.forEach((msg) => {
        const field = msg.split(' ')[0]; // Extract field prefix
        const step = fieldToStepMap[field];
        if (!this.errors[field]) {
          this.errors[field] = [];
        }
        this.errors[field].push(msg);
        // Record the first step containing an error
        if (firstErrorStep === null || step < firstErrorStep) {
          firstErrorStep = step;
        }        
      });

      // Navigate to the first step with an error
      if (firstErrorStep !== null) {
        this.currentStep = firstErrorStep;
      }      
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
